/**
 * نظام النسخ الاحتياطي الشامل
 * هذا الملف يحتوي على كافة الوظائف المتعلقة بنظام النسخ الاحتياطي الشامل
 * @author Claude
 * @date 2025-05-14
 * @version 1.0.0
 */

// متغيرات عامة لنظام النسخ الاحتياطي
let fullBackupHistory = [];
let backupFolder = './backups';
let currentBackupOperation = null;
let isRestoringBackup = false;

// تهيئة نظام النسخ الاحتياطي
document.addEventListener('DOMContentLoaded', function() {
    // تحميل سجل النسخ الاحتياطية
    loadFullBackupHistory();
    
    // تحديث إحصائيات النسخ الاحتياطية
    updateBackupStats();
    
    // إنشاء مجلد النسخ الاحتياطية إذا لم يكن موجودًا
    ensureBackupFolderExists();
});

/**
 * تحميل سجل النسخ الاحتياطية من التخزين المحلي
 */
function loadFullBackupHistory() {
    try {
        const storedHistory = localStorage.getItem('fullBackupHistory');
        if (storedHistory) {
            fullBackupHistory = JSON.parse(storedHistory);
            
            // تحديث قائمة النسخ الاحتياطية في واجهة المستخدم
            updateBackupHistoryUI();
            
            // تحديث تاريخ آخر نسخة احتياطية
            updateLastBackupDate();
        }
    } catch (error) {
        console.error('خطأ في تحميل سجل النسخ الاحتياطية:', error);
    }
}

/**
 * حفظ سجل النسخ الاحتياطية في التخزين المحلي
 */
function saveFullBackupHistory() {
    try {
        localStorage.setItem('fullBackupHistory', JSON.stringify(fullBackupHistory));
    } catch (error) {
        console.error('خطأ في حفظ سجل النسخ الاحتياطية:', error);
    }
}

/**
 * تحديث إحصائيات النسخ الاحتياطية في واجهة المستخدم
 */
function updateBackupStats() {
    // تحديث عدد المستثمرين
    const backupInvestorsCount = document.getElementById('backupInvestorsCount');
    if (backupInvestorsCount) {
        backupInvestorsCount.textContent = investors.length;
    }
    
    // تحديث عدد الاستثمارات
    const backupInvestmentsCount = document.getElementById('backupInvestmentsCount');
    if (backupInvestmentsCount) {
        backupInvestmentsCount.textContent = investments.length;
    }
    
    // تحديث عدد العمليات
    const backupOperationsCount = document.getElementById('backupOperationsCount');
    if (backupOperationsCount) {
        backupOperationsCount.textContent = operations.length;
    }
}

/**
 * تحديث تاريخ آخر نسخة احتياطية في واجهة المستخدم
 */
function updateLastBackupDate() {
    const lastFullBackupDate = document.getElementById('lastFullBackupDate');
    if (!lastFullBackupDate) return;
    
    if (fullBackupHistory.length > 0) {
        // ترتيب النسخ الاحتياطية حسب التاريخ (الأحدث أولاً)
        const sortedBackups = [...fullBackupHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // تحديث تاريخ آخر نسخة احتياطية
        const lastBackup = sortedBackups[0];
        lastFullBackupDate.textContent = `${formatDate(lastBackup.date)} ${formatTime(lastBackup.date)}`;
    } else {
        lastFullBackupDate.textContent = 'لا يوجد';
    }
}

/**
 * تحديث قائمة النسخ الاحتياطية في واجهة المستخدم
 */
function updateBackupHistoryUI() {
    // تحديث جدول النسخ الاحتياطية
    const tableBody = document.getElementById('backupHistoryTableBody');
    if (!tableBody) return;
    
    // ترتيب النسخ الاحتياطية حسب التاريخ (الأحدث أولاً)
    const sortedBackups = [...fullBackupHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedBackups.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">لا توجد نسخ احتياطية سابقة</td></tr>`;
    } else {
        tableBody.innerHTML = '';
        
        sortedBackups.forEach(backup => {
            const row = document.createElement('tr');
            
            // تحديد محتوى النسخة الاحتياطية كنص
            let contentText = '';
            if (backup.content) {
                const contentArray = [];
                if (backup.content.investors) contentArray.push('المستثمرين');
                if (backup.content.investments) contentArray.push('الاستثمارات');
                if (backup.content.operations) contentArray.push('العمليات');
                if (backup.content.settings) contentArray.push('الإعدادات');
                if (backup.content.events) contentArray.push('الأحداث');
                if (backup.content.notifications) contentArray.push('الإشعارات');
                
                contentText = contentArray.join(', ');
            } else {
                contentText = 'نسخة كاملة';
            }
            
            // تحديد حجم النسخة الاحتياطية
            const size = backup.size ? formatFileSize(backup.size) : 'غير معروف';
            
            row.innerHTML = `
                <td>${backup.name || 'نسخة احتياطية'}</td>
                <td>${formatDate(backup.date)} ${formatTime(backup.date)}</td>
                <td>${size}</td>
                <td>${contentText}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-icon action-btn" onclick="viewBackupDetails('${backup.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning btn-icon action-btn" onclick="selectBackupForRestore('${backup.id}')">
                        <i class="fas fa-upload"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon action-btn" onclick="removeBackupFromHistory('${backup.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // تحديث قائمة النسخ الاحتياطية في قسم الاستعادة
    const backupHistoryList = document.getElementById('backupHistoryList');
    if (backupHistoryList) {
        backupHistoryList.innerHTML = '';
        
        if (sortedBackups.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'لا توجد نسخ احتياطية سابقة';
            option.disabled = true;
            backupHistoryList.appendChild(option);
        } else {
            sortedBackups.forEach(backup => {
                const option = document.createElement('option');
                option.value = backup.id;
                option.textContent = `${backup.name || 'نسخة احتياطية'} - ${formatDate(backup.date)} ${formatTime(backup.date)}`;
                backupHistoryList.appendChild(option);
            });
        }
    }
}

/**
 * تبديل طريقة الاستعادة (من ملف أو من السجل)
 */
function toggleRestoreMethod() {
    const fileSection = document.getElementById('restoreFileSection');
    const historySection = document.getElementById('restoreHistorySection');
    
    const restoreMethodFile = document.getElementById('restoreMethodFile');
    
    if (restoreMethodFile && restoreMethodFile.checked) {
        // الاستعادة من ملف
        if (fileSection) fileSection.style.display = 'block';
        if (historySection) historySection.style.display = 'none';
    } else {
        // الاستعادة من السجل
        if (fileSection) fileSection.style.display = 'none';
        if (historySection) historySection.style.display = 'block';
    }
}

/**
 * تنسيق حجم الملف بصيغة مقروءة
 * @param {number} sizeInBytes - حجم الملف بالبايت
 * @returns {string} - حجم الملف بصيغة مقروءة
 */
function formatFileSize(sizeInBytes) {
    if (sizeInBytes < 1024) {
        return sizeInBytes + ' بايت';
    } else if (sizeInBytes < 1024 * 1024) {
        return (sizeInBytes / 1024).toFixed(2) + ' كيلوبايت';
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
        return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' ميجابايت';
    } else {
        return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + ' جيجابايت';
    }
}

/**
 * التأكد من وجود مجلد النسخ الاحتياطية
 */
function ensureBackupFolderExists() {
    // هذه الوظيفة تحتاج إلى تكامل مع وسيط خادم لإنشاء مجلدات
    // في بيئة المتصفح، سنفترض أن المجلد موجود
    
    // تحديث مسار مجلد النسخ الاحتياطية في واجهة المستخدم
    const backupFolderPath = document.getElementById('backupFolderPath');
    if (backupFolderPath) {
        backupFolderPath.value = backupFolder;
    }
}

/**
 * تغيير مجلد النسخ الاحتياطية
 */
function changeBackupFolder() {
    // في بيئة المتصفح العادية، لا يمكن اختيار مجلد
    // يمكن استخدام electron's dialog API في تطبيق سطح المكتب
    
    // لأغراض العرض، سنستخدم نافذة حوار بسيطة
    const newFolder = prompt('أدخل مسار مجلد النسخ الاحتياطية الجديد:', backupFolder);
    
    if (newFolder && newFolder.trim() !== '') {
        backupFolder = newFolder.trim();
        
        // تحديث مسار المجلد في واجهة المستخدم
        const backupFolderPath = document.getElementById('backupFolderPath');
        if (backupFolderPath) {
            backupFolderPath.value = backupFolder;
        }
        
        // حفظ المسار الجديد في الإعدادات
        localStorage.setItem('backupFolder', backupFolder);
        
        // إظهار إشعار نجاح
        createNotification('نجاح', 'تم تغيير مجلد النسخ الاحتياطية بنجاح', 'success');
    }
}

/**
 * فتح مجلد النسخ الاحتياطية
 */
function openBackupFolder() {
    // في بيئة المتصفح العادية، لا يمكن فتح مجلد
    // يمكن استخدام electron's shell API في تطبيق سطح المكتب
    
    // لأغراض العرض، سنعرض رسالة
    createNotification('معلومات', `مسار مجلد النسخ الاحتياطية: ${backupFolder}`, 'info');
    
    // إذا كان هناك تكامل مع Electron
    if (window.electron && window.electron.openFolder) {
        window.electron.openFolder(backupFolder);
    }
}

/**
 * مسح سجل النسخ الاحتياطية
 */
function clearBackupHistory() {
    // طلب تأكيد من المستخدم
    if (!confirm('هل أنت متأكد من رغبتك في مسح سجل النسخ الاحتياطية؟ لن يتم حذف ملفات النسخ الاحتياطية نفسها.')) {
        return;
    }
    
    // مسح سجل النسخ الاحتياطية
    fullBackupHistory = [];
    
    // حفظ السجل الفارغ
    saveFullBackupHistory();
    
    // تحديث واجهة المستخدم
    updateBackupHistoryUI();
    updateLastBackupDate();
    
    // إظهار إشعار نجاح
    createNotification('نجاح', 'تم مسح سجل النسخ الاحتياطية بنجاح', 'success');
}

/**
 * تحديث سجل النسخ الاحتياطية
 */
function refreshBackupHistory() {
    // في نظام حقيقي، يمكن البحث عن ملفات النسخ الاحتياطية في المجلد
    // ومزامنة السجل معها
    
    // لأغراض العرض، سنعيد تحميل السجل من التخزين المحلي
    loadFullBackupHistory();
    
    // إظهار إشعار نجاح
    createNotification('نجاح', 'تم تحديث سجل النسخ الاحتياطية', 'success');
}

/**
 * عرض تفاصيل نسخة احتياطية
 * @param {string} backupId - معرف النسخة الاحتياطية
 */
function viewBackupDetails(backupId) {
    // البحث عن النسخة الاحتياطية في السجل
    const backup = fullBackupHistory.find(b => b.id === backupId);
    
    if (!backup) {
        createNotification('خطأ', 'النسخة الاحتياطية غير موجودة', 'danger');
        return;
    }
    
    // إنشاء نافذة حوار لعرض التفاصيل
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'backupDetailsModal';
    
    // تحديد محتوى النسخة الاحتياطية كنص
    let contentDetails = '';
    if (backup.content) {
        contentDetails = `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">المستثمرين</label>
                    <div>${backup.content.investors ? 'نعم' : 'لا'}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">الاستثمارات</label>
                    <div>${backup.content.investments ? 'نعم' : 'لا'}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">العمليات</label>
                    <div>${backup.content.operations ? 'نعم' : 'لا'}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">الإعدادات</label>
                    <div>${backup.content.settings ? 'نعم' : 'لا'}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">الأحداث</label>
                    <div>${backup.content.events ? 'نعم' : 'لا'}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">الإشعارات</label>
                    <div>${backup.content.notifications ? 'نعم' : 'لا'}</div>
                </div>
            </div>
        `;
    } else {
        contentDetails = `<p>نسخة احتياطية كاملة تشمل جميع البيانات.</p>`;
    }
    
    // تحديد صيغ التصدير كنص
    let formatsText = '';
    if (backup.formats) {
        const formats = [];
        if (backup.formats.json) formats.push('JSON');
        if (backup.formats.excel) formats.push('Excel');
        if (backup.formats.pdf) formats.push('PDF');
        if (backup.formats.word) formats.push('Word');
        
        formatsText = formats.join(', ');
    } else {
        formatsText = 'JSON';
    }
    
    // إنشاء محتوى نافذة الحوار
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">تفاصيل النسخة الاحتياطية</h2>
                <div class="modal-close" onclick="document.getElementById('backupDetailsModal').remove()">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            <div class="modal-body">
                <div class="form-container" style="box-shadow: none; padding: 0;">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">الاسم</label>
                            <div>${backup.name || 'نسخة احتياطية'}</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">التاريخ</label>
                            <div>${formatDate(backup.date)} ${formatTime(backup.date)}</div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">الحجم</label>
                            <div>${backup.size ? formatFileSize(backup.size) : 'غير معروف'}</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">الصيغ</label>
                            <div>${formatsText}</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">الوصف</label>
                        <div>${backup.description || 'لا يوجد وصف'}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">المسار</label>
                        <div>${backup.path || backupFolder}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">محتوى النسخة الاحتياطية</label>
                        ${contentDetails}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-light" onclick="document.getElementById('backupDetailsModal').remove()">إغلاق</button>
                <button class="btn btn-warning" onclick="document.getElementById('backupDetailsModal').remove(); selectBackupForRestore('${backup.id}')">
                    <i class="fas fa-upload"></i> استعادة
                </button>
                <button class="btn btn-info" onclick="downloadBackupFiles('${backup.id}')">
                    <i class="fas fa-download"></i> تنزيل الملفات
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * تنزيل ملفات النسخة الاحتياطية
 * @param {string} backupId - معرف النسخة الاحتياطية
 */
function downloadBackupFiles(backupId) {
    // البحث عن النسخة الاحتياطية في السجل
    const backup = fullBackupHistory.find(b => b.id === backupId);
    
    if (!backup) {
        createNotification('خطأ', 'النسخة الاحتياطية غير موجودة', 'danger');
        return;
    }
    
    // إنشاء نافذة حوار لتنزيل الملفات
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'downloadBackupModal';
    
    // تحديد ملفات النسخة الاحتياطية المتاحة
    let filesHtml = '';
    
    if (backup.formats) {
        if (backup.formats.json) {
            filesHtml += `
                <div class="form-group">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="downloadJson" checked>
                        <label class="form-check-label" for="downloadJson">النسخة الاحتياطية (JSON)</label>
                    </div>
                    <button class="btn btn-sm btn-primary" style="margin-top: 5px;" onclick="downloadBackupFile('${backupId}', 'json')">
                        <i class="fas fa-download"></i> تنزيل
                    </button>
                </div>
            `;
        }
        
        if (backup.formats.excel) {
            filesHtml += `
                <div class="form-group">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="downloadExcel" checked>
                        <label class="form-check-label" for="downloadExcel">جدول البيانات (Excel)</label>
                    </div>
                    <button class="btn btn-sm btn-primary" style="margin-top: 5px;" onclick="downloadBackupFile('${backupId}', 'excel')">
                        <i class="fas fa-download"></i> تنزيل
                    </button>
                </div>
            `;
        }
        
        if (backup.formats.pdf) {
            filesHtml += `
                <div class="form-group">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="downloadPdf" checked>
                        <label class="form-check-label" for="downloadPdf">تقرير مفصل (PDF)</label>
                    </div>
                    <button class="btn btn-sm btn-primary" style="margin-top: 5px;" onclick="downloadBackupFile('${backupId}', 'pdf')">
                        <i class="fas fa-download"></i> تنزيل
                    </button>
                </div>
            `;
        }
        
        if (backup.formats.word) {
            filesHtml += `
                <div class="form-group">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="downloadWord" checked>
                        <label class="form-check-label" for="downloadWord">تقرير مفصل (Word)</label>
                    </div>
                    <button class="btn btn-sm btn-primary" style="margin-top: 5px;" onclick="downloadBackupFile('${backupId}', 'word')">
                        <i class="fas fa-download"></i> تنزيل
                    </button>
                </div>
            `;
        }
    } else {
        // الصيغة الافتراضية هي JSON
        filesHtml = `
            <div class="form-group">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="downloadJson" checked>
                    <label class="form-check-label" for="downloadJson">النسخة الاحتياطية (JSON)</label>
                </div>
                <button class="btn btn-sm btn-primary" style="margin-top: 5px;" onclick="downloadBackupFile('${backupId}', 'json')">
                    <i class="fas fa-download"></i> تنزيل
                </button>
            </div>
        `;
    }
    
    // إنشاء محتوى نافذة الحوار
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">تنزيل ملفات النسخة الاحتياطية</h2>
                <div class="modal-close" onclick="document.getElementById('downloadBackupModal').remove()">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            <div class="modal-body">
                <div class="form-container" style="box-shadow: none; padding: 0;">
                    <div class="form-group">
                        <label class="form-label">النسخة الاحتياطية</label>
                        <div>${backup.name || 'نسخة احتياطية'} - ${formatDate(backup.date)} ${formatTime(backup.date)}</div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">الملفات المتاحة</label>
                        <div class="form-row">
                            ${filesHtml}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <button class="btn btn-primary" onclick="downloadAllBackupFiles('${backupId}')">
                            <i class="fas fa-download"></i> تنزيل جميع الملفات
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-light" onclick="document.getElementById('downloadBackupModal').remove()">إغلاق</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * تنزيل ملف نسخة احتياطية محدد
 * @param {string} backupId - معرف النسخة الاحتياطية
 * @param {string} format - صيغة الملف (json, excel, pdf, word)
 */
function downloadBackupFile(backupId, format) {
    // البحث عن النسخة الاحتياطية في السجل
    const backup = fullBackupHistory.find(b => b.id === backupId);
    
    if (!backup) {
        createNotification('خطأ', 'النسخة الاحتياطية غير موجودة', 'danger');
        return;
    }
    
    // في تطبيق حقيقي، سنقوم بتنزيل الملف من المجلد المحدد
    // في بيئة المتصفح، سنقوم بإنشاء الملف وتنزيله
    
    let fileData, fileName, mimeType;
    
    switch (format) {
        case 'json':
            // إنشاء ملف JSON
            fileData = JSON.stringify(backup.data || {}, null, 2);
            fileName = `backup_${formatDateForFileName(backup.date)}.json`;
            mimeType = 'application/json';
            break;
            
        case 'excel':
            // في تطبيق حقيقي، سنقوم بإنشاء ملف Excel حقيقي
            // للعرض، سنقوم بتنزيل ملف نصي
            fileData = 'This is a placeholder for Excel file';
            fileName = `backup_${formatDateForFileName(backup.date)}.xlsx`;
            mimeType = 'text/plain';
            
            // إظهار إشعار
            createNotification('معلومات', 'تنزيل ملف Excel غير متاح في هذه النسخة التجريبية', 'info');
            return;
            
        case 'pdf':
            // في تطبيق حقيقي، سنقوم بإنشاء ملف PDF حقيقي
            // للعرض، سنقوم بتنزيل ملف نصي
            fileData = 'This is a placeholder for PDF file';
            fileName = `backup_${formatDateForFileName(backup.date)}.pdf`;
            mimeType = 'text/plain';
            
            // إظهار إشعار
            createNotification('معلومات', 'تنزيل ملف PDF غير متاح في هذه النسخة التجريبية', 'info');
            return;
            
        case 'word':
            // في تطبيق حقيقي، سنقوم بإنشاء ملف Word حقيقي
            // للعرض، سنقوم بتنزيل ملف نصي
            fileData = 'This is a placeholder for Word file';
            fileName = `backup_${formatDateForFileName(backup.date)}.docx`;
            mimeType = 'text/plain';
            
            // إظهار إشعار
            createNotification('معلومات', 'تنزيل ملف Word غير متاح في هذه النسخة التجريبية', 'info');
            return;
            
        default:
            createNotification('خطأ', 'صيغة الملف غير مدعومة', 'danger');
            return;
    }
    
    // إنشاء رابط تنزيل وتنزيل الملف
    const blob = new Blob([fileData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // تحرير الرابط
    URL.revokeObjectURL(url);
    
    // إظهار إشعار نجاح
    createNotification('نجاح', `تم تنزيل الملف ${fileName} بنجاح`, 'success');
}

/**
 * تنزيل جميع ملفات النسخة الاحتياطية
 * @param {string} backupId - معرف النسخة الاحتياطية
 */
function downloadAllBackupFiles(backupId) {
    // البحث عن النسخة الاحتياطية في السجل
    const backup = fullBackupHistory.find(b => b.id === backupId);
    
    if (!backup) {
        createNotification('خطأ', 'النسخة الاحتياطية غير موجودة', 'danger');
        return;
    }
    
    // تنزيل كل ملف على حدة
    if (backup.formats) {
        if (backup.formats.json) {
            downloadBackupFile(backupId, 'json');
        }
        
        if (backup.formats.excel) {
            // إظهار إشعار
            createNotification('معلومات', 'تنزيل ملف Excel غير متاح في هذه النسخة التجريبية', 'info');
        }
        
        if (backup.formats.pdf) {
            // إظهار إشعار
            createNotification('معلومات', 'تنزيل ملف PDF غير متاح في هذه النسخة التجريبية', 'info');
        }
        
        if (backup.formats.word) {
            // إظهار إشعار
            createNotification('معلومات', 'تنزيل ملف Word غير متاح في هذه النسخة التجريبية', 'info');
        }
    } else {
        // تنزيل الملف الافتراضي (JSON)
        downloadBackupFile(backupId, 'json');
    }
    
    // إظهار إشعار نجاح
    createNotification('نجاح', 'تم بدء تنزيل جميع الملفات المتاحة', 'success');
}

/**
 * تنسيق التاريخ لاستخدامه في اسم الملف
 * @param {string} date - التاريخ
 * @returns {string} - التاريخ المنسق
 */
function formatDateForFileName(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}_${d.getHours().toString().padStart(2, '0')}-${d.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * اختيار نسخة احتياطية للاستعادة
 * @param {string} backupId - معرف النسخة الاحتياطية
 */
function selectBackupForRestore(backupId) {
    // التبديل إلى طريقة الاستعادة من السجل
    const restoreMethodHistory = document.getElementById('restoreMethodHistory');
    if (restoreMethodHistory) {
        restoreMethodHistory.checked = true;
        toggleRestoreMethod();
    }
    
    // اختيار النسخة الاحتياطية من القائمة
    const backupHistoryList = document.getElementById('backupHistoryList');
    if (backupHistoryList) {
        backupHistoryList.value = backupId;
    }
    
    // إغلاق نافذة التفاصيل إذا كانت مفتوحة
    const detailsModal = document.getElementById('backupDetailsModal');
    if (detailsModal) {
        detailsModal.remove();
    }
    
    // إغلاق نافذة التنزيل إذا كانت مفتوحة
    const downloadModal = document.getElementById('downloadBackupModal');
    if (downloadModal) {
        downloadModal.remove();
    }
    
    // التمرير إلى قسم الاستعادة
    const restoreSection = document.getElementById('restoreHistorySection');
    if (restoreSection) {
        restoreSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // إظهار إشعار
    createNotification('معلومات', 'تم اختيار النسخة الاحتياطية للاستعادة. انقر على "استعادة من السجل" للمتابعة.', 'info');
}

/**
 * إزالة نسخة احتياطية من السجل
 * @param {string} backupId - معرف النسخة الاحتياطية
 */
function removeBackupFromHistory(backupId) {
    // البحث عن النسخة الاحتياطية في السجل
    const backup = fullBackupHistory.find(b => b.id === backupId);
    
    if (!backup) {
        createNotification('خطأ', 'النسخة الاحتياطية غير موجودة', 'danger');
        return;
    }
    
    // تأكيد الحذف
    if (!confirm(`هل أنت متأكد من رغبتك في إزالة النسخة الاحتياطية "${backup.name || 'نسخة احتياطية'}" من السجل؟`)) {
        return;
    }
    
    // إزالة النسخة الاحتياطية من السجل
    fullBackupHistory = fullBackupHistory.filter(b => b.id !== backupId);
    
    // حفظ السجل المحدث
    saveFullBackupHistory();
    
    // تحديث واجهة المستخدم
    updateBackupHistoryUI();
    updateLastBackupDate();
    
    // إظهار إشعار نجاح
    createNotification('نجاح', 'تم إزالة النسخة الاحتياطية من السجل بنجاح', 'success');
}

/**
 * إنشاء نسخة احتياطية شاملة
 */
function createFullBackup() {
    // التحقق مما إذا كانت هناك عملية نسخ احتياطي قيد التنفيذ
    if (currentBackupOperation) {
        createNotification('تنبيه', 'هناك عملية نسخ احتياطي قيد التنفيذ بالفعل', 'warning');
        return;
    }
    
    // الحصول على اسم ووصف النسخة الاحتياطية
    const backupName = document.getElementById('fullBackupName').value || 'نسخة احتياطية شاملة';
    const backupDescription = document.getElementById('fullBackupDescription').value || '';
    
    // الحصول على صيغ التصدير
    const exportJson = document.getElementById('exportJson').checked;
    const exportExcel = document.getElementById('exportExcel').checked;
    const exportPdf = document.getElementById('exportPdf').checked;
    const exportWord = document.getElementById('exportWord').checked;
    
    // التحقق من اختيار صيغة واحدة على الأقل
    if (!exportJson && !exportExcel && !exportPdf && !exportWord) {
        createNotification('خطأ', 'يجب اختيار صيغة تصدير واحدة على الأقل', 'danger');
        return;
    }
    
    // الحصول على محتوى النسخة الاحتياطية
    const backupInvestors = document.getElementById('backupInvestors').checked;
    const backupInvestments = document.getElementById('backupInvestments').checked;
    const backupOperations = document.getElementById('backupOperations').checked;
    const backupSettings = document.getElementById('backupSettings').checked;
    const backupEvents = document.getElementById('backupEvents').checked;
    const backupNotifications = document.getElementById('backupNotifications').checked;
    
    // التحقق من اختيار محتوى واحد على الأقل
    if (!backupInvestors && !backupInvestments && !backupOperations && !backupSettings && !backupEvents && !backupNotifications) {
        createNotification('خطأ', 'يجب اختيار محتوى واحد على الأقل للنسخة الاحتياطية', 'danger');
        return;
    }
    
    // إظهار شريط التقدم
    const backupProgress = document.getElementById('backupProgress');
    const backupProgressBar = document.getElementById('backupProgressBar');
    const backupStatusText = document.getElementById('backupStatusText');
    
    if (backupProgress) backupProgress.style.display = 'block';
    if (backupProgressBar) {
        backupProgressBar.style.width = '0%';
        backupProgressBar.setAttribute('aria-valuenow', '0');
        backupProgressBar.textContent = '0%';
    }
    if (backupStatusText) backupStatusText.textContent = 'جاري تجهيز النسخة الاحتياطية...';
    
    // إنشاء معرف فريد للنسخة الاحتياطية
    const backupId = generateId();
    
    // إنشاء كائن النسخة الاحتياطية
    const backup = {
        id: backupId,
        name: backupName,
        description: backupDescription,
        date: new Date().toISOString(),
        formats: {
            json: exportJson,
            excel: exportExcel,
            pdf: exportPdf,
            word: exportWord
        },
        content: {
            investors: backupInvestors,
            investments: backupInvestments,
            operations: backupOperations,
            settings: backupSettings,
            events: backupEvents,
            notifications: backupNotifications
        },
        path: backupFolder
    };
    
    // بدء عملية النسخ الاحتياطي
    currentBackupOperation = backup;
    
    // بدء محاكاة التقدم
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        
        if (backupProgressBar) {
            backupProgressBar.style.width = `${progress}%`;
            backupProgressBar.setAttribute('aria-valuenow', progress.toString());
            backupProgressBar.textContent = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            finishBackupOperation(backup);
        } else {
            // تحديث نص الحالة
            if (backupStatusText) {
                if (progress < 20) {
                    backupStatusText.textContent = 'جاري تجهيز البيانات...';
                } else if (progress < 40) {
                    backupStatusText.textContent = 'جاري تجميع محتوى النسخة الاحتياطية...';
                } else if (progress < 60) {
                    backupStatusText.textContent = 'جاري إنشاء ملفات النسخة الاحتياطية...';
                } else if (progress < 80) {
                    backupStatusText.textContent = 'جاري حفظ الملفات...';
                } else {
                    backupStatusText.textContent = 'جاري إكمال عملية النسخ الاحتياطي...';
                }
            }
        }
    }, 100);
}

/**
 * إنهاء عملية النسخ الاحتياطي
 * @param {object} backup - كائن النسخة الاحتياطية
 */
function finishBackupOperation(backup) {
    // تجميع بيانات النسخة الاحتياطية
    const backupData = {};
    
    if (backup.content.investors) {
        backupData.investors = investors;
    }
    
    if (backup.content.investments) {
        backupData.investments = investments;
    }
    
    if (backup.content.operations) {
        backupData.operations = operations;
    }
    
    if (backup.content.settings) {
        backupData.settings = settings;
    }
    
    if (backup.content.events) {
        backupData.events = events;
    }
    
    if (backup.content.notifications) {
        backupData.notifications = notifications;
    }
    
    // إضافة البيانات وحجم الملف إلى كائن النسخة الاحتياطية
    backup.data = backupData;
    backup.size = JSON.stringify(backupData).length;
    
    // إضافة النسخة الاحتياطية إلى السجل
    fullBackupHistory.push(backup);
    
    // حفظ السجل المحدث
    saveFullBackupHistory();
    
    // تحديث واجهة المستخدم
    updateBackupHistoryUI();
    updateLastBackupDate();
    
    // إخفاء شريط التقدم
    const backupProgress = document.getElementById('backupProgress');
    if (backupProgress) {
        // تحديث نص الحالة أولاً
        const backupStatusText = document.getElementById('backupStatusText');
        if (backupStatusText) backupStatusText.textContent = 'تم إنشاء النسخة الاحتياطية بنجاح!';
        
        // إخفاء شريط التقدم بعد فترة قصيرة
        setTimeout(() => {
            backupProgress.style.display = 'none';
        }, 2000);
    }
    
    // إنهاء عملية النسخ الاحتياطي
    currentBackupOperation = null;
    
    // إظهار إشعار نجاح
    createNotification('نجاح', 'تم إنشاء النسخة الاحتياطية الشاملة بنجاح', 'success');
    
    // تنزيل ملف JSON تلقائيًا إذا تم اختيار تلك الصيغة
    if (backup.formats.json) {
        // تنزيل ملف JSON
        const fileData = JSON.stringify(backupData, null, 2);
        const fileName = `backup_${formatDateForFileName(backup.date)}.json`;
        const mimeType = 'application/json';
        
        const blob = new Blob([fileData], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // تحرير الرابط
        URL.revokeObjectURL(url);
    }
}

/**
 * استعادة البيانات من ملف
 */
function restoreFromFile() {
    // التحقق مما إذا كانت هناك عملية استعادة قيد التنفيذ
    if (isRestoringBackup) {
        createNotification('تنبيه', 'هناك عملية استعادة قيد التنفيذ بالفعل', 'warning');
        return;
    }
    
    // الحصول على الملف
    const fileInput = document.getElementById('fullRestoreFile');
    
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        createNotification('خطأ', 'يرجى اختيار ملف النسخة الاحتياطية', 'danger');
        return;
    }
    
    // التحقق من نوع الملف
    const file = fileInput.files[0];
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        createNotification('خطأ', 'يجب اختيار ملف بصيغة JSON', 'danger');
        return;
    }
    
    // تأكيد الاستعادة
    if (!confirm('هل أنت متأكد من رغبتك في استعادة البيانات من هذا الملف؟ سيتم استبدال جميع البيانات الحالية.')) {
        return;
    }
    
    // بدء عملية الاستعادة
    isRestoringBackup = true;
    
    // قراءة محتوى الملف
    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            // تحليل محتوى الملف
            const backupData = JSON.parse(event.target.result);
            
            // التحقق من صحة البيانات
            if (!backupData || typeof backupData !== 'object') {
                throw new Error('بيانات النسخة الاحتياطية غير صالحة');
            }
            
            // محاكاة تقدم عملية الاستعادة
            simulateRestoreProgress(() => {
                // استعادة البيانات
                restoreDataFromBackup(backupData);
                
                // إنهاء عملية الاستعادة
                isRestoringBackup = false;
                
                // إظهار إشعار نجاح
                createNotification('نجاح', 'تم استعادة البيانات بنجاح', 'success');
                
                // إعادة تحميل الصفحة بعد فترة قصيرة
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
        } catch (error) {
            console.error('خطأ في استعادة البيانات:', error);
            
            // إنهاء عملية الاستعادة
            isRestoringBackup = false;
            
            // إظهار إشعار خطأ
            createNotification('خطأ', `حدث خطأ أثناء استعادة البيانات: ${error.message}`, 'danger');
        }
    };
    
    reader.onerror = function() {
        // إنهاء عملية الاستعادة
        isRestoringBackup = false;
        
        // إظهار إشعار خطأ
        createNotification('خطأ', 'حدث خطأ أثناء قراءة الملف', 'danger');
    };
    
    // قراءة الملف كنص
    reader.readAsText(file);
}

/**
 * استعادة البيانات من السجل
 */
function restoreFromHistory() {
    // التحقق مما إذا كانت هناك عملية استعادة قيد التنفيذ
    if (isRestoringBackup) {
        createNotification('تنبيه', 'هناك عملية استعادة قيد التنفيذ بالفعل', 'warning');
        return;
    }
    
    // الحصول على النسخة الاحتياطية المختارة
    const backupHistoryList = document.getElementById('backupHistoryList');
    
    if (!backupHistoryList || !backupHistoryList.value) {
        createNotification('خطأ', 'يرجى اختيار نسخة احتياطية من القائمة', 'danger');
        return;
    }
    
    // البحث عن النسخة الاحتياطية في السجل
    const backup = fullBackupHistory.find(b => b.id === backupHistoryList.value);
    
    if (!backup) {
        createNotification('خطأ', 'النسخة الاحتياطية غير موجودة', 'danger');
        return;
    }
    
    // تأكيد الاستعادة
    if (!confirm(`هل أنت متأكد من رغبتك في استعادة البيانات من النسخة الاحتياطية "${backup.name || 'نسخة احتياطية'}"؟ سيتم استبدال جميع البيانات الحالية.`)) {
        return;
    }
    
    // بدء عملية الاستعادة
    isRestoringBackup = true;
    
    // محاكاة تقدم عملية الاستعادة
    simulateRestoreProgress(() => {
        // استعادة البيانات
        if (backup.data) {
            restoreDataFromBackup(backup.data);
            
            // إنهاء عملية الاستعادة
            isRestoringBackup = false;
            
            // إظهار إشعار نجاح
            createNotification('نجاح', 'تم استعادة البيانات بنجاح', 'success');
            
            // إعادة تحميل الصفحة بعد فترة قصيرة
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            // إنهاء عملية الاستعادة
            isRestoringBackup = false;
            
            // إظهار إشعار خطأ
            createNotification('خطأ', 'النسخة الاحتياطية لا تحتوي على بيانات', 'danger');
        }
    });
}

/**
 * محاكاة تقدم عملية الاستعادة
 * @param {Function} callback - دالة يتم استدعاؤها عند اكتمال العملية
 */
function simulateRestoreProgress(callback) {
    // إنشاء نافذة حوار لعرض التقدم
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'restoreProgressModal';
    
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">استعادة البيانات</h2>
            </div>
            <div class="modal-body">
                <div class="form-container" style="box-shadow: none; padding: 0;">
                    <div class="form-group">
                        <label class="form-label">جاري استعادة البيانات...</label>
                        <div class="progress" style="margin-top: 10px;">
                            <div class="progress-bar" id="restoreProgressBar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                        </div>
                        <p id="restoreStatusText" style="margin-top: 10px; text-align: center;">جاري تجهيز عملية الاستعادة...</p>
                    </div>
                    
                    <div class="alert alert-warning" style="margin-top: 20px;">
                        <div class="alert-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">تنبيه</div>
                            <div class="alert-text">يرجى عدم إغلاق المتصفح أو تحديث الصفحة أثناء عملية الاستعادة.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بدء محاكاة التقدم
    let progress = 0;
    const progressBar = document.getElementById('restoreProgressBar');
    const statusText = document.getElementById('restoreStatusText');
    
    const progressInterval = setInterval(() => {
        progress += 5;
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress.toString());
            progressBar.textContent = `${progress}%`;
        }
        
        // تحديث نص الحالة
        if (statusText) {
            if (progress < 20) {
                statusText.textContent = 'جاري تحليل البيانات...';
            } else if (progress < 40) {
                statusText.textContent = 'جاري التحقق من صحة البيانات...';
            } else if (progress < 60) {
                statusText.textContent = 'جاري استعادة المستثمرين والاستثمارات...';
            } else if (progress < 80) {
                statusText.textContent = 'جاري استعادة العمليات والإعدادات...';
            } else {
                statusText.textContent = 'جاري إكمال عملية الاستعادة...';
            }
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // تحديث نص الحالة
            if (statusText) {
                statusText.textContent = 'تم استعادة البيانات بنجاح!';
            }
            
            // إغلاق نافذة التقدم بعد فترة قصيرة
            setTimeout(() => {
                const modal = document.getElementById('restoreProgressModal');
                if (modal) {
                    modal.remove();
                }
                
                // استدعاء دالة رد النداء
                if (typeof callback === 'function') {
                    callback();
                }
            }, 1000);
        }
    }, 100);
}

/**
 * استعادة البيانات من النسخة الاحتياطية
 * @param {object} backupData - بيانات النسخة الاحتياطية
 */
function restoreDataFromBackup(backupData) {
    // استعادة المستثمرين
    if (backupData.investors) {
        investors = backupData.investors;
    }
    
    // استعادة الاستثمارات
    if (backupData.investments) {
        investments = backupData.investments;
    }
    
    // استعادة العمليات
    if (backupData.operations) {
        operations = backupData.operations;
    }
    
    // استعادة الإعدادات
    if (backupData.settings) {
        settings = {...settings, ...backupData.settings};
    }
    
    // استعادة الأحداث
    if (backupData.events) {
        events = backupData.events;
    }
    
    // استعادة الإشعارات
    if (backupData.notifications) {
        notifications = backupData.notifications;
    }
    
    // حفظ البيانات
    saveData();
    saveNotifications();
}

// إضافة الوظائف إلى الكائن العام
window.createFullBackup = createFullBackup;
window.restoreFromFile = restoreFromFile;
window.restoreFromHistory = restoreFromHistory;
window.changeBackupFolder = changeBackupFolder;
window.openBackupFolder = openBackupFolder;
window.clearBackupHistory = clearBackupHistory;
window.refreshBackupHistory = refreshBackupHistory;
window.viewBackupDetails = viewBackupDetails;
window.downloadBackupFile = downloadBackupFile;
window.downloadAllBackupFiles = downloadAllBackupFiles;
window.selectBackupForRestore = selectBackupForRestore;
window.removeBackupFromHistory = removeBackupFromHistory;
window.toggleRestoreMethod = toggleRestoreMethod;

/**
 * تكامل النسخ الاحتياطي الشامل مع النظام الرئيسي
 * ملف التكامل يتم تضمينه في نهاية ملف index.html
 */

// إضافة نافذة تبويب النسخ الاحتياطي الشامل إلى واجهة الإعدادات
document.addEventListener('DOMContentLoaded', function() {
    // إضافة تبويب النسخ الاحتياطي الشامل إلى قائمة التبويبات
    const settingsTabs = document.querySelector('#settings .tabs');
    if (settingsTabs) {
        const fullBackupTab = document.createElement('div');
        fullBackupTab.className = 'tab';
        fullBackupTab.setAttribute('onclick', "switchSettingsTab('fullBackup')");
        fullBackupTab.textContent = 'النسخ الاحتياطي الشامل';
        
        // إضافة التبويب بعد تبويب النسخ الاحتياطي العادي
        const backupTab = document.querySelector('#settings .tab[onclick="switchSettingsTab(\'backup\')"]');
        if (backupTab) {
            settingsTabs.insertBefore(fullBackupTab, backupTab.nextSibling);
        } else {
            settingsTabs.appendChild(fullBackupTab);
        }
    }
    
    // إنشاء محتوى تبويب النسخ الاحتياطي الشامل
    createFullBackupTabContent();
    
    // إضافة مستمع لتبديل طريقة الاستعادة
    document.addEventListener('click', function(event) {
        if (event.target && (
            event.target.id === 'restoreMethodFile' || 
            event.target.id === 'restoreMethodHistory'
        )) {
            toggleRestoreMethod();
        }
    });
    
    // تحميل سجل النسخ الاحتياطية
    if (typeof loadFullBackupHistory === 'function') {
        loadFullBackupHistory();
    }
});

/**
 * إنشاء محتوى تبويب النسخ الاحتياطي الشامل
 */
function createFullBackupTabContent() {
    // التحقق مما إذا كان المحتوى موجوداً بالفعل
    if (document.getElementById('fullBackupSettings')) {
        return;
    }
    
    // إنشاء عنصر المحتوى
    const fullBackupContent = document.createElement('div');
    fullBackupContent.id = 'fullBackupSettings';
    fullBackupContent.className = 'settings-tab-content';
    
    // وضع المحتوى داخل صفحة الإعدادات
    const settingsPage = document.getElementById('settings');
    if (settingsPage) {
        settingsPage.appendChild(fullBackupContent);
    }
    
    // إضافة المحتوى الفعلي
    fullBackupContent.innerHTML = `
    <div class="form-container">
        <div class="form-header">
            <h2 class="form-title">النسخ الاحتياطي الشامل</h2>
            <p class="form-subtitle">إنشاء واستعادة نسخة احتياطية كاملة لجميع بيانات التطبيق</p>
        </div>
        
        <div class="dashboard-cards" style="margin-bottom: 30px;">
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">إجمالي المستثمرين</div>
                        <div class="card-value" id="backupInvestorsCount">0</div>
                    </div>
                    <div class="card-icon primary">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">إجمالي الاستثمارات</div>
                        <div class="card-value" id="backupInvestmentsCount">0</div>
                    </div>
                    <div class="card-icon success">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">إجمالي العمليات</div>
                        <div class="card-value" id="backupOperationsCount">0</div>
                    </div>
                    <div class="card-icon warning">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">آخر نسخة احتياطية</div>
                        <div class="card-value" id="lastFullBackupDate">لا يوجد</div>
                    </div>
                    <div class="card-icon info">
                        <i class="fas fa-history"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <h3 class="form-subtitle">إنشاء نسخة احتياطية جديدة</h3>
            <p class="form-text">سيتم إنشاء نسخة احتياطية كاملة لجميع بيانات التطبيق بما في ذلك المستثمرين والاستثمارات والعمليات والإعدادات.</p>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">اسم النسخة الاحتياطية (اختياري)</label>
                    <input type="text" class="form-control" id="fullBackupName" placeholder="نسخة احتياطية شاملة">
                </div>
                <div class="form-group">
                    <label class="form-label">وصف النسخة الاحتياطية (اختياري)</label>
                    <input type="text" class="form-control" id="fullBackupDescription" placeholder="وصف اختياري للنسخة الاحتياطية">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">صيغ التصدير</label>
                <div class="form-row">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="exportJson" checked>
                        <label class="form-check-label" for="exportJson">JSON (أساسي للاستعادة)</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="exportExcel" checked>
                        <label class="form-check-label" for="exportExcel">Excel</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="exportPdf" checked>
                        <label class="form-check-label" for="exportPdf">PDF</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="exportWord" checked>
                        <label class="form-check-label" for="exportWord">Word</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">محتوى النسخة الاحتياطية</label>
                <div class="form-row">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="backupInvestors" checked>
                        <label class="form-check-label" for="backupInvestors">المستثمرين</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="backupInvestments" checked>
                        <label class="form-check-label" for="backupInvestments">الاستثمارات</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="backupOperations" checked>
                        <label class="form-check-label" for="backupOperations">العمليات</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="backupSettings" checked>
                        <label class="form-check-label" for="backupSettings">الإعدادات</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="backupEvents" checked>
                        <label class="form-check-label" for="backupEvents">الأحداث</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="backupNotifications" checked>
                        <label class="form-check-label" for="backupNotifications">الإشعارات</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <button class="btn btn-primary btn-lg" onclick="createFullBackup()">
                    <i class="fas fa-download"></i> إنشاء نسخة احتياطية شاملة
                </button>
                <div class="backup-progress" id="backupProgress" style="display: none; margin-top: 15px;">
                    <div class="progress">
                        <div class="progress-bar" id="backupProgressBar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                    </div>
                    <p id="backupStatusText" style="margin-top: 5px; text-align: center;">جاري إنشاء النسخة الاحتياطية...</p>
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <h3 class="form-subtitle">استعادة من نسخة احتياطية</h3>
            <p class="form-text">استعادة بيانات التطبيق من نسخة احتياطية سابقة.</p>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">طريقة الاستعادة</label>
                    <div class="form-row">
                        <div class="form-check">
                            <input type="radio" class="form-check-input" id="restoreMethodFile" name="restoreMethod" value="file" checked>
                            <label class="form-check-label" for="restoreMethodFile">استعادة من ملف</label>
                        </div>
                        <div class="form-check">
                            <input type="radio" class="form-check-input" id="restoreMethodHistory" name="restoreMethod" value="history">
                            <label class="form-check-label" for="restoreMethodHistory">استعادة من السجل</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="restoreFileSection">
                <div class="form-group">
                    <label class="form-label">ملف النسخة الاحتياطية (JSON)</label>
                    <input type="file" class="form-control" id="fullRestoreFile" accept=".json">
                    <small class="form-text" style="margin-top: 5px;">يجب اختيار ملف بصيغة JSON تم إنشاؤه بواسطة النظام.</small>
                </div>
                
                <div class="form-group">
                    <button class="btn btn-warning btn-lg" onclick="restoreFromFile()">
                        <i class="fas fa-upload"></i> استعادة من ملف
                    </button>
                </div>
            </div>
            
            <div id="restoreHistorySection" style="display: none;">
                <div class="form-group">
                    <label class="form-label">النسخ الاحتياطية السابقة</label>
                    <select class="form-select" id="backupHistoryList" size="5" style="height: auto;">
                        <!-- سيتم تعبئة القائمة بواسطة JavaScript -->
                    </select>
                </div>
                
                <div class="form-group">
                    <button class="btn btn-warning btn-lg" onclick="restoreFromHistory()">
                        <i class="fas fa-history"></i> استعادة من السجل
                    </button>
                </div>
            </div>
            
            <div class="form-group" style="margin-top: 10px;">
                <div class="alert alert-warning">
                    <div class="alert-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">تنبيه هام</div>
                        <div class="alert-text">سيتم استبدال جميع البيانات الحالية بالبيانات من النسخة الاحتياطية. يرجى التأكد من عمل نسخة احتياطية من البيانات الحالية قبل الاستعادة.</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <h3 class="form-subtitle">سجل النسخ الاحتياطية</h3>
            <p class="form-text">قائمة بجميع النسخ الاحتياطية التي تم إنشاؤها.</p>
            
            <div class="table-container" style="box-shadow: var(--box-shadow); margin-bottom: 20px;">
                <div class="table-header">
                    <div class="table-title">النسخ الاحتياطية السابقة</div>
                    <button class="btn btn-sm btn-light" onclick="refreshBackupHistory()">
                        <i class="fas fa-sync"></i> تحديث
                    </button>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>التاريخ</th>
                            <th>الحجم</th>
                            <th>المحتوى</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="backupHistoryTableBody">
                        <!-- سيتم تعبئة الجدول بواسطة JavaScript -->
                    </tbody>
                </table>
            </div>
            
            <div class="form-group">
                <label class="form-label">مجلد النسخ الاحتياطية</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="backupFolderPath" value="./backups" readonly>
                    <button class="btn btn-light" type="button" onclick="changeBackupFolder()">
                        <i class="fas fa-folder-open"></i> تغيير
                    </button>
                </div>
                <small class="form-text" style="margin-top: 5px;">سيتم حفظ النسخ الاحتياطية في هذا المجلد. تأكد من وجود صلاحيات الكتابة.</small>
            </div>
            
            <div class="form-group">
                <button class="btn btn-light" onclick="openBackupFolder()">
                    <i class="fas fa-folder-open"></i> فتح مجلد النسخ الاحتياطية
                </button>
                <button class="btn btn-danger" onclick="clearBackupHistory()">
                    <i class="fas fa-trash"></i> مسح السجل
                </button>
            </div>
        </div>
    </div>
    `;
    
    // تحديث إحصائيات النسخ الاحتياطية
    setTimeout(() => {
        if (typeof updateBackupStats === 'function') {
            updateBackupStats();
        }
    }, 100);
}

/**
 * إنشاء المجلدات اللازمة عند تحميل التطبيق
 */
function ensureBackupFoldersExist() {
    // التحقق من وجود تكامل مع Electron
    if (window.electron && window.electron.createFolder) {
        // إنشاء المجلد الرئيسي للنسخ الاحتياطية
        window.electron.createFolder('./backups');
        
        // إنشاء المجلدات الفرعية حسب نوع الملف
        window.electron.createFolder('./backups/json');
        window.electron.createFolder('./backups/excel');
        window.electron.createFolder('./backups/pdf');
        window.electron.createFolder('./backups/word');
    }
}

/**
 * إنشاء تكامل مع Electron إذا كان متاحاً
 */
function setupElectronIntegration() {
    // في التطبيق الحقيقي، سيتم توفير هذه الواجهة من Electron
    if (!window.electron) {
        window.electron = {
            // إنشاء مجلد
            createFolder: function(path) {
                console.log('إنشاء مجلد:', path);
                return true;
            },
            
            // فتح مجلد
            openFolder: function(path) {
                console.log('فتح مجلد:', path);
                alert(`سيتم فتح المجلد: ${path}`);
                return true;
            },
            
            // تصدير ملف Excel
            exportExcel: function(data, filePath) {
                console.log('تصدير ملف Excel:', filePath);
                console.log('البيانات:', data);
                return true;
            },
            
            // تصدير ملف PDF
            exportPdf: function(data, filePath) {
                console.log('تصدير ملف PDF:', filePath);
                console.log('البيانات:', data);
                return true;
            },
            
            // تصدير ملف Word
            exportWord: function(data, filePath) {
                console.log('تصدير ملف Word:', filePath);
                console.log('البيانات:', data);
                return true;
            }
        };
    }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء تكامل مع Electron
    setupElectronIntegration();
    
    // إنشاء المجلدات اللازمة
    ensureBackupFoldersExist();
    
    // إضافة النسخ الاحتياطي الشامل إلى الإعدادات العامة
    if (window.settings) {
        window.settings.fullBackupEnabled = true;
        window.settings.fullBackupFolder = './backups';
        window.settings.autoFullBackup = false;
        window.settings.autoFullBackupFrequency = 'weekly';
    }
});

// إضافة دعم الأحداث للنظام
var fullBackupEvents = {
    // حدث بدء النسخ الاحتياطي
    onBackupStart: function() {
        console.log('بدء عملية النسخ الاحتياطي الشامل');
        createNotification('معلومات', 'بدء عملية النسخ الاحتياطي الشامل', 'info');
    },
    
    // حدث انتهاء النسخ الاحتياطي
    onBackupComplete: function(backupId) {
        console.log('اكتمال عملية النسخ الاحتياطي الشامل:', backupId);
        createNotification('نجاح', 'تم إنشاء النسخة الاحتياطية الشاملة بنجاح', 'success');
    },
    
    // حدث فشل النسخ الاحتياطي
    onBackupFail: function(error) {
        console.error('فشل عملية النسخ الاحتياطي الشامل:', error);
        createNotification('خطأ', `فشل عملية النسخ الاحتياطي الشامل: ${error.message}`, 'danger');
    },
    
    // حدث بدء الاستعادة
    onRestoreStart: function() {
        console.log('بدء عملية استعادة النسخة الاحتياطية الشاملة');
        createNotification('معلومات', 'بدء عملية استعادة النسخة الاحتياطية الشاملة', 'info');
    },
    
    // حدث انتهاء الاستعادة
    onRestoreComplete: function() {
        console.log('اكتمال عملية استعادة النسخة الاحتياطية الشاملة');
        createNotification('نجاح', 'تم استعادة النسخة الاحتياطية الشاملة بنجاح', 'success');
    },
    
    // حدث فشل الاستعادة
    onRestoreFail: function(error) {
        console.error('فشل عملية استعادة النسخة الاحتياطية الشاملة:', error);
        createNotification('خطأ', `فشل عملية استعادة النسخة الاحتياطية الشاملة: ${error.message}`, 'danger');
    }
};

// إضافة النظام إلى الكائن العام
window.fullBackupSystem = {
    // إصدار النظام
    version: '1.0.0',
    
    // تاريخ آخر تحديث
    lastUpdated: '2025-05-14',
    
    // الأحداث
    events: fullBackupEvents,
    
    // تهيئة النظام
    init: function() {
        console.log('تهيئة نظام النسخ الاحتياطي الشامل');
        
        // تحديث إحصائيات النسخ الاحتياطية
        if (typeof updateBackupStats === 'function') {
            updateBackupStats();
        }
        
        // تحميل سجل النسخ الاحتياطية
        if (typeof loadFullBackupHistory === 'function') {
            loadFullBackupHistory();
        }
        
        // إنشاء المجلدات اللازمة
        ensureBackupFoldersExist();
        
        return this;
    },
    
    // إنشاء نسخة احتياطية
    createBackup: function(options) {
        if (typeof createFullBackup === 'function') {
            this.events.onBackupStart();
            createFullBackup(options);
        }
    },
    
    // استعادة نسخة احتياطية من ملف
    restoreFromFile: function() {
        if (typeof restoreFromFile === 'function') {
            this.events.onRestoreStart();
            restoreFromFile();
        }
    },
    
    // استعادة نسخة احتياطية من السجل
    restoreFromHistory: function(backupId) {
        if (typeof restoreFromHistory === 'function') {
            this.events.onRestoreStart();
            restoreFromHistory(backupId);
        }
    }
};

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام النسخ الاحتياطي الشامل
    if (window.fullBackupSystem) {
        window.fullBackupSystem.init();
    }
});

// تطبيق أنماط CSS إضافية
(function() {
    // إنشاء عنصر النمط
    const style = document.createElement('style');
    style.textContent = `
        /* أنماط النسخ الاحتياطي الشامل */
        .progress {
            height: 20px;
            background-color: var(--gray-200);
            border-radius: var(--border-radius);
            overflow: hidden;
        }
        
        .progress-bar {
            height: 100%;
            background-color: var(--primary-color);
            color: white;
            text-align: center;
            line-height: 20px;
            transition: width 0.3s ease;
        }
        
        .backup-progress {
            margin-top: 15px;
            padding: 10px;
            background-color: var(--gray-100);
            border-radius: var(--border-radius);
        }
        
        /* تحسينات إضافية */
        #fullBackupSettings .card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        #fullBackupSettings .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        #fullBackupSettings .btn-lg {
            padding: 12px 24px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        #fullBackupSettings .btn-lg:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        #fullBackupSettings .table-container {
            border-radius: var(--border-radius);
            overflow: hidden;
            transition: box-shadow 0.3s ease;
        }
        
        #fullBackupSettings .table-container:hover {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        /* تحريك ظهور النسخ الاحتياطية في الجدول */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        #backupHistoryTableBody tr {
            animation: fadeInUp 0.5s ease forwards;
        }
        
        #backupHistoryTableBody tr:nth-child(2) {
            animation-delay: 0.1s;
        }
        
        #backupHistoryTableBody tr:nth-child(3) {
            animation-delay: 0.2s;
        }
        
        #backupHistoryTableBody tr:nth-child(4) {
            animation-delay: 0.3s;
        }
        
        #backupHistoryTableBody tr:nth-child(5) {
            animation-delay: 0.4s;
        }
    `;
    
    // إضافة عنصر النمط إلى رأس الصفحة
    document.head.appendChild(style);
})();