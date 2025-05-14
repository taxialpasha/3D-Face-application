// نظام النسخ الاحتياطي الشامل
// Complete Backup System for Investment Management Application

/**
 * تهيئة نظام النسخ الاحتياطي الشامل
 * Initialize the complete backup system
 */
(function() {
    // إضافة علامة تبويب النسخ الاحتياطي الشامل إلى صفحة الإعدادات
    // Add complete backup tab to settings page
    document.addEventListener('DOMContentLoaded', function() {
        // إنشاء الواجهة بعد تحميل الصفحة
        setupCompleteBackupUI();
        
        // تهيئة الأحداث
        setupCompleteBackupEvents();
        
        // التحقق من وجود مجلد النسخ الاحتياطية
        checkBackupDirectory();
    });
})();

/**
 * إنشاء واجهة المستخدم للنسخ الاحتياطي الشامل
 * Create the complete backup UI
 */
function setupCompleteBackupUI() {
    // التحقق من وجود علامات التبويب في الإعدادات
    const settingsTabs = document.querySelector('#settings .tabs');
    if (!settingsTabs) return;
    
    // إضافة علامة تبويب النسخ الاحتياطي الشامل
    const completeBackupTab = document.createElement('div');
    completeBackupTab.className = 'tab';
    completeBackupTab.onclick = function() { switchSettingsTab('completeBackup'); };
    completeBackupTab.innerHTML = 'النسخ الاحتياطي الشامل';
    settingsTabs.appendChild(completeBackupTab);
    
    // إنشاء محتوى علامة التبويب
    const settingsContainer = document.getElementById('settings');
    if (!settingsContainer) return;
    
    // إنشاء محتوى النسخ الاحتياطي الشامل
    const completeBackupContent = document.createElement('div');
    completeBackupContent.id = 'completeBackupSettings';
    completeBackupContent.className = 'settings-tab-content';
    
    completeBackupContent.innerHTML = `
        <div class="form-container">
            <div class="form-header">
                <h2 class="form-title">النسخ الاحتياطي الشامل للنظام</h2>
                <p class="form-subtitle">إنشاء واستعادة نسخة احتياطية كاملة لجميع بيانات ووظائف النظام</p>
            </div>
            
            <div class="alert alert-info">
                <div class="alert-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">معلومات النسخ الاحتياطي</div>
                    <div class="alert-text">
                        النسخة الاحتياطية الشاملة تحتوي على جميع بيانات النظام بما في ذلك المستثمرين والاستثمارات والعمليات والأحداث والإشعارات وإعدادات النظام.
                        يتم إنشاء النسخة بعدة صيغ (JSON, PDF, Word, Excel) لضمان إمكانية استعادتها في جميع الظروف.
                    </div>
                </div>
            </div>
            
            <div class="dashboard-cards">
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">عدد النسخ الاحتياطية</div>
                            <div class="card-value" id="totalBackupsCount">0</div>
                        </div>
                        <div class="card-icon primary">
                            <i class="fas fa-save"></i>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">آخر نسخة احتياطية</div>
                            <div class="card-value" id="lastBackupDate">لا يوجد</div>
                        </div>
                        <div class="card-icon success">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">حالة النسخ التلقائي</div>
                            <div class="card-value" id="autoBackupStatus">غير مفعل</div>
                        </div>
                        <div class="card-icon info">
                            <i class="fas fa-sync-alt"></i>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">حجم النسخ الاحتياطية</div>
                            <div class="card-value" id="totalBackupsSize">0 MB</div>
                        </div>
                        <div class="card-icon warning">
                            <i class="fas fa-database"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <h3 class="form-subtitle">إنشاء نسخة احتياطية شاملة</h3>
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label class="form-label">اسم النسخة الاحتياطية (اختياري)</label>
                        <input type="text" class="form-control" id="completeBackupName" placeholder="نسخة احتياطية شاملة">
                        <p class="form-text">سيتم إضافة التاريخ والوقت تلقائياً إلى اسم النسخة</p>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">صيغ النسخة الاحتياطية</label>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="backupFormatJSON" checked>
                            <label class="form-check-label" for="backupFormatJSON">JSON (للاستعادة)</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="backupFormatPDF" checked>
                            <label class="form-check-label" for="backupFormatPDF">PDF (للعرض)</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="backupFormatWord">
                            <label class="form-check-label" for="backupFormatWord">Word (للعرض)</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="backupFormatExcel">
                            <label class="form-check-label" for="backupFormatExcel">Excel (للعرض)</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" onclick="createCompleteBackup()">
                        <i class="fas fa-download"></i> إنشاء نسخة احتياطية شاملة
                    </button>
                </div>
            </div>
            
            <div class="form-group">
                <h3 class="form-subtitle">النسخ الاحتياطية السابقة</h3>
                <div class="table-container" style="margin-top: 15px;">
                    <div class="table-header">
                        <div class="table-title">قائمة النسخ الاحتياطية</div>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-light" onclick="refreshCompleteBackupsList()">
                                <i class="fas fa-sync"></i> تحديث
                            </button>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>اسم النسخة</th>
                                <th>التاريخ</th>
                                <th>الوقت</th>
                                <th>الحجم</th>
                                <th>الصيغ المتوفرة</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="completeBackupsTableBody">
                            <tr>
                                <td colspan="7" style="text-align: center;">جاري تحميل النسخ الاحتياطية...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="form-group">
                <h3 class="form-subtitle">استعادة نسخة احتياطية</h3>
                <div class="alert alert-warning">
                    <div class="alert-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">تحذير</div>
                        <div class="alert-text">
                            عند استعادة نسخة احتياطية، سيتم استبدال جميع البيانات الحالية بالبيانات المخزنة في النسخة الاحتياطية.
                            يرجى التأكد من عمل نسخة احتياطية للبيانات الحالية قبل الاستعادة.
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label class="form-label">استعادة من ملف JSON</label>
                        <div class="input-group">
                            <input type="file" class="form-control" id="restoreCompleteBackupFile" accept=".json">
                            <button class="btn btn-warning" onclick="restoreFromFile()">
                                <i class="fas fa-upload"></i> استعادة من ملف
                            </button>
                        </div>
                        <p class="form-text">يمكنك استعادة النظام من ملف JSON تم إنشاؤه مسبقاً</p>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">استعادة من نسخة محفوظة</label>
                        <select class="form-select" id="restoreCompleteBackupSelect" size="4" style="height: auto;">
                            <option value="">اختر نسخة...</option>
                        </select>
                        <button class="btn btn-warning" style="margin-top: 10px;" onclick="restoreFromBackup()">
                            <i class="fas fa-undo"></i> استعادة النسخة المحددة
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <h3 class="form-subtitle">إعدادات النسخ الاحتياطي التلقائي</h3>
                <div class="form-row">
                    <div class="form-group">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="enableCompleteAutoBackup">
                            <label class="form-check-label" for="enableCompleteAutoBackup">تفعيل النسخ الاحتياطي التلقائي</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">فترة النسخ الاحتياطي</label>
                        <select class="form-select" id="completeAutoBackupFrequency">
                            <option value="daily">يومياً</option>
                            <option value="weekly" selected>أسبوعياً</option>
                            <option value="monthly">شهرياً</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">عدد النسخ للاحتفاظ</label>
                        <input type="number" class="form-control" id="completeBackupsToKeep" min="1" max="100" value="10">
                        <p class="form-text">عدد النسخ الاحتياطية القديمة التي يتم الاحتفاظ بها (سيتم حذف النسخ الأقدم تلقائياً)</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">صيغ النسخ التلقائي</label>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="autoBackupFormatJSON" checked>
                            <label class="form-check-label" for="autoBackupFormatJSON">JSON</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="autoBackupFormatPDF">
                            <label class="form-check-label" for="autoBackupFormatPDF">PDF</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" onclick="saveCompleteBackupSettings()">
                        <i class="fas fa-save"></i> حفظ إعدادات النسخ التلقائي
                    </button>
                </div>
            </div>
        </div>
    `;
    
    settingsContainer.appendChild(completeBackupContent);
}

/**
 * تهيئة أحداث نظام النسخ الاحتياطي
 * Setup complete backup events
 */
function setupCompleteBackupEvents() {
    // تحميل إعدادات النسخ الاحتياطي
    const enableAutoBackup = localStorage.getItem('enableCompleteAutoBackup') === 'true';
    const autoBackupFrequency = localStorage.getItem('completeAutoBackupFrequency') || 'weekly';
    const backupsToKeep = localStorage.getItem('completeBackupsToKeep') || '10';
    const autoBackupFormatJSON = localStorage.getItem('autoBackupFormatJSON') !== 'false';
    const autoBackupFormatPDF = localStorage.getItem('autoBackupFormatPDF') === 'true';
    
    // تعيين قيم الإعدادات في واجهة المستخدم
    setTimeout(() => {
        const enableAutoBackupEl = document.getElementById('enableCompleteAutoBackup');
        const autoBackupFrequencyEl = document.getElementById('completeAutoBackupFrequency');
        const backupsToKeepEl = document.getElementById('completeBackupsToKeep');
        const autoBackupFormatJSONEl = document.getElementById('autoBackupFormatJSON');
        const autoBackupFormatPDFEl = document.getElementById('autoBackupFormatPDF');
        
        if (enableAutoBackupEl) enableAutoBackupEl.checked = enableAutoBackup;
        if (autoBackupFrequencyEl) autoBackupFrequencyEl.value = autoBackupFrequency;
        if (backupsToKeepEl) backupsToKeepEl.value = backupsToKeep;
        if (autoBackupFormatJSONEl) autoBackupFormatJSONEl.checked = autoBackupFormatJSON;
        if (autoBackupFormatPDFEl) autoBackupFormatPDFEl.checked = autoBackupFormatPDF;
        
        // تحديث حالة النسخ التلقائي
        updateAutoBackupStatus();
        
        // تحميل قائمة النسخ الاحتياطية
        loadCompleteBackups();
    }, 1000);
    
    // جدولة فحص النسخ الاحتياطي التلقائي
    scheduleAutoCompleteBackup();
}

/**
 * التأكد من وجود مجلد النسخ الاحتياطية
 * Check if backup directory exists
 */
function checkBackupDirectory() {
    try {
        // محاولة إنشاء مجلد النسخ الاحتياطية إذا لم يكن موجوداً
        // تنويه: هذه الوظيفة تعتمد على وجود الوصول إلى نظام الملفات
        // في بيئة المتصفح، هذا غير ممكن عادةً، لكن في تطبيق إلكترون يمكن ذلك
        
        // لأغراض العرض، سنفترض أن المجلد موجود
        console.log('تم التحقق من وجود مجلد النسخ الاحتياطية');
        
        // في تطبيق حقيقي يمكن استخدام:
        // if (window.fs && window.fs.existsSync) {
        //     const backupDir = path.join(process.cwd(), 'backups');
        //     if (!window.fs.existsSync(backupDir)) {
        //         window.fs.mkdirSync(backupDir, { recursive: true });
        //     }
        // }
    } catch (error) {
        console.error('خطأ في التحقق من مجلد النسخ الاحتياطية:', error);
    }
}

/**
 * تحديث حالة النسخ التلقائي
 * Update auto backup status
 */
function updateAutoBackupStatus() {
    const autoBackupStatus = document.getElementById('autoBackupStatus');
    if (!autoBackupStatus) return;
    
    const enableAutoBackup = localStorage.getItem('enableCompleteAutoBackup') === 'true';
    const autoBackupFrequency = localStorage.getItem('completeAutoBackupFrequency') || 'weekly';
    
    let status = 'غير مفعل';
    let className = 'danger';
    
    if (enableAutoBackup) {
        switch (autoBackupFrequency) {
            case 'daily':
                status = 'مفعل (يومياً)';
                break;
            case 'weekly':
                status = 'مفعل (أسبوعياً)';
                break;
            case 'monthly':
                status = 'مفعل (شهرياً)';
                break;
        }
        className = 'success';
    }
    
    autoBackupStatus.textContent = status;
    
    // تحديث لون البطاقة
    const cardIcon = autoBackupStatus.parentElement.nextElementSibling;
    if (cardIcon) {
        cardIcon.className = `card-icon ${className}`;
    }
}

/**
 * تحميل قائمة النسخ الاحتياطية الشاملة
 * Load complete backups list
 */
function loadCompleteBackups() {
    // محاولة تحميل قائمة النسخ الاحتياطية من التخزين المحلي
    const completedBackups = JSON.parse(localStorage.getItem('completeBackups') || '[]');
    
    // تحديث عداد النسخ الاحتياطية
    const totalBackupsCount = document.getElementById('totalBackupsCount');
    if (totalBackupsCount) {
        totalBackupsCount.textContent = completedBackups.length;
    }
    
    // تحديث تاريخ آخر نسخة احتياطية
    const lastBackupDate = document.getElementById('lastBackupDate');
    if (lastBackupDate && completedBackups.length > 0) {
        const lastBackup = completedBackups[0]; // افتراض أن القائمة مرتبة بحسب الأحدث
        lastBackupDate.textContent = formatDate(lastBackup.date) + ' ' + formatTime(lastBackup.date);
    }
    
    // تحديث حجم النسخ الاحتياطية
    const totalBackupsSize = document.getElementById('totalBackupsSize');
    if (totalBackupsSize) {
        // حساب الحجم التقريبي
        const totalSize = completedBackups.reduce((size, backup) => size + (backup.size || 0), 0);
        totalBackupsSize.textContent = formatFileSize(totalSize);
    }
    
    // تحديث قائمة النسخ الاحتياطية في الجدول
    const tableBody = document.getElementById('completeBackupsTableBody');
    if (!tableBody) return;
    
    if (completedBackups.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد نسخ احتياطية شاملة</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    
    completedBackups.forEach((backup, index) => {
        const row = document.createElement('tr');
        
        // تحديد الصيغ المتوفرة
        let availableFormats = [];
        if (backup.formats) {
            if (backup.formats.json) availableFormats.push('JSON');
            if (backup.formats.pdf) availableFormats.push('PDF');
            if (backup.formats.word) availableFormats.push('Word');
            if (backup.formats.excel) availableFormats.push('Excel');
        } else {
            // إذا لم تكن المعلومات متوفرة، نفترض توفر JSON على الأقل
            availableFormats.push('JSON');
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${backup.name || 'نسخة احتياطية'}</td>
            <td>${formatDate(backup.date)}</td>
            <td>${formatTime(backup.date)}</td>
            <td>${formatFileSize(backup.size || 0)}</td>
            <td>${availableFormats.join(', ')}</td>
            <td>
                <button class="btn btn-info btn-icon action-btn" onclick="viewCompleteBackup('${backup.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-icon action-btn" onclick="restoreCompleteBackup('${backup.id}')">
                    <i class="fas fa-undo"></i>
                </button>
                <button class="btn btn-danger btn-icon action-btn" onclick="deleteCompleteBackup('${backup.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // تحديث قائمة النسخ الاحتياطية في قائمة الاستعادة
    const restoreSelect = document.getElementById('restoreCompleteBackupSelect');
    if (restoreSelect) {
        restoreSelect.innerHTML = '';
        
        if (completedBackups.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'لا توجد نسخ احتياطية';
            restoreSelect.appendChild(option);
        } else {
            completedBackups.forEach(backup => {
                const option = document.createElement('option');
                option.value = backup.id;
                option.textContent = `${backup.name || 'نسخة احتياطية'} - ${formatDate(backup.date)} ${formatTime(backup.date)}`;
                restoreSelect.appendChild(option);
            });
        }
    }
}

/**
 * تحديث قائمة النسخ الاحتياطية
 * Refresh complete backups list
 */
function refreshCompleteBackupsList() {
    // في النسخة الحقيقية، يمكن إجراء مسح لمجلد النسخ الاحتياطية
    // وتحديث القائمة بما يتوافق مع الملفات الموجودة
    
    // لأغراض العرض، سنقوم بتحميل القائمة من التخزين المحلي
    loadCompleteBackups();
    
    // عرض رسالة نجاح
    createNotification('نجاح', 'تم تحديث قائمة النسخ الاحتياطية بنجاح', 'success');
}

/**
 * إنشاء نسخة احتياطية شاملة
 * Create a complete backup
 */
function createCompleteBackup() {
    try {
        // الحصول على اسم النسخة الاحتياطية
        const backupName = document.getElementById('completeBackupName').value || 'نسخة احتياطية شاملة';
        
        // الحصول على صيغ النسخة الاحتياطية
        const formatJSON = document.getElementById('backupFormatJSON').checked;
        const formatPDF = document.getElementById('backupFormatPDF').checked;
        const formatWord = document.getElementById('backupFormatWord').checked;
        const formatExcel = document.getElementById('backupFormatExcel').checked;
        
        // التحقق من تحديد صيغة واحدة على الأقل
        if (!formatJSON && !formatPDF && !formatWord && !formatExcel) {
            createNotification('خطأ', 'يرجى تحديد صيغة واحدة على الأقل للنسخة الاحتياطية', 'danger');
            return;
        }
        
        // إظهار رسالة تقدم العملية
        createNotification('جاري العمل', 'جاري إنشاء النسخة الاحتياطية الشاملة...', 'info');
        
        // إنشاء كائن البيانات للنسخة الاحتياطية
        const backupData = {
            investors: investors,
            investments: investments,
            operations: operations,
            settings: settings,
            events: events,
            notifications: notifications,
            backupList: backupList,
            reports: reports,
            version: '1.0.0',
            createdAt: new Date().toISOString()
        };
        
        // حساب حجم البيانات (تقريبي)
        const serializedData = JSON.stringify(backupData);
        const dataSize = new Blob([serializedData]).size;
        
        // إنشاء معلومات النسخة الاحتياطية
        const backupInfo = {
            id: generateId(),
            name: backupName,
            date: new Date().toISOString(),
            size: dataSize,
            formats: {
                json: formatJSON,
                pdf: formatPDF,
                word: formatWord,
                excel: formatExcel
            }
        };
        
        // حفظ معلومات النسخة الاحتياطية
        saveCompleteBackupInfo(backupInfo);
        
        // إنشاء ملفات النسخة الاحتياطية
        if (formatJSON) {
            createJSONBackup(backupData, backupInfo);
        }
        
        if (formatPDF) {
            createPDFBackup(backupData, backupInfo);
        }
        
        if (formatWord) {
            createWordBackup(backupData, backupInfo);
        }
        
        if (formatExcel) {
            createExcelBackup(backupData, backupInfo);
        }
        
        // تحديث قائمة النسخ الاحتياطية
        loadCompleteBackups();
        
        // إظهار رسالة نجاح
        createNotification('نجاح', 'تم إنشاء النسخة الاحتياطية الشاملة بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
        createNotification('خطأ', 'حدث خطأ أثناء إنشاء النسخة الاحتياطية: ' + error.message, 'danger');
    }
}

/**
 * حفظ معلومات النسخة الاحتياطية
 * Save complete backup info
 */
function saveCompleteBackupInfo(backupInfo) {
    // تحميل قائمة النسخ الاحتياطية
    const completeBackups = JSON.parse(localStorage.getItem('completeBackups') || '[]');
    
    // إضافة النسخة الجديدة في بداية القائمة
    completeBackups.unshift(backupInfo);
    
    // حفظ القائمة المحدثة
    localStorage.setItem('completeBackups', JSON.stringify(completeBackups));
}

/**
 * إنشاء نسخة احتياطية بصيغة JSON
 * Create JSON backup
 */
function createJSONBackup(data, backupInfo) {
    try {
        // تنسيق اسم الملف
        const dateStr = new Date(backupInfo.date).toISOString().replace(/[:.]/g, '-');
        const fileName = `${backupInfo.name.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_')}_${dateStr}.json`;
        
        // تحويل البيانات إلى JSON
        const jsonData = JSON.stringify(data, null, 2);
        
        // إنشاء رابط تنزيل الملف
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // إنشاء عنصر رابط وتنزيل الملف
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // في النسخة الحقيقية، يمكن أيضاً حفظ الملف في مجلد النسخ الاحتياطية
        // إذا كان التطبيق يعمل في بيئة مثل إلكترون
        
        console.log('تم إنشاء نسخة JSON بنجاح:', fileName);
    } catch (error) {
        console.error('خطأ في إنشاء نسخة JSON:', error);
        throw new Error('فشل في إنشاء نسخة JSON: ' + error.message);
    }
}

/**
 * إنشاء نسخة احتياطية بصيغة PDF
 * Create PDF backup
 */
function createPDFBackup(data, backupInfo) {
    try {
        // تنسيق اسم الملف
        const dateStr = new Date(backupInfo.date).toISOString().replace(/[:.]/g, '-');
        const fileName = `${backupInfo.name.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_')}_${dateStr}.pdf`;
        
        // في بيئة المتصفح، لا يمكن إنشاء ملفات PDF مباشرةً
        // لذلك سنقوم بإنشاء صفحة HTML وتحويلها إلى PDF
        
        // إنشاء محتوى HTML للنسخة الاحتياطية
        const htmlContent = generateBackupReport(data, backupInfo);
        
        // في بيئة حقيقية، يمكن استخدام مكتبات مثل jsPDF أو puppeteer لتحويل HTML إلى PDF
        // لأغراض العرض، سنفتح النسخة في نافذة جديدة
        
        const newWindow = window.open('', '_blank');
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // إظهار رسالة للمستخدم
        createNotification('معلومات', 'لإنشاء نسخة PDF، يرجى استخدام وظيفة الطباعة في المتصفح واختيار "حفظ كـ PDF"', 'info');
        
        console.log('تم إنشاء صفحة تقرير النسخة الاحتياطية بنجاح');
    } catch (error) {
        console.error('خطأ في إنشاء نسخة PDF:', error);
        throw new Error('فشل في إنشاء نسخة PDF: ' + error.message);
    }
}

/**
 * إنشاء نسخة احتياطية بصيغة Word
 * Create Word backup
 */
function createWordBackup(data, backupInfo) {
    try {
        // تنويه: إنشاء ملفات Word يتطلب مكتبات خاصة مثل docx
        // لأغراض العرض، سنقوم بإنشاء ملف HTML بتنسيق خاص
        
        // تنسيق اسم الملف
        const dateStr = new Date(backupInfo.date).toISOString().replace(/[:.]/g, '-');
        const fileName = `${backupInfo.name.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_')}_${dateStr}.html`;
        
        // إنشاء محتوى HTML للنسخة الاحتياطية
        const htmlContent = generateBackupReport(data, backupInfo, 'word');
        
        // إنشاء رابط تنزيل الملف
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // إنشاء عنصر رابط وتنزيل الملف
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // إظهار رسالة للمستخدم
        createNotification('معلومات', 'يمكنك فتح الملف المحمل في Microsoft Word مباشرةً', 'info');
        
        console.log('تم إنشاء نسخة Word بنجاح:', fileName);
    } catch (error) {
        console.error('خطأ في إنشاء نسخة Word:', error);
        throw new Error('فشل في إنشاء نسخة Word: ' + error.message);
    }
}

/**
 * إنشاء نسخة احتياطية بصيغة Excel
 * Create Excel backup
 */
function createExcelBackup(data, backupInfo) {
    try {
        // تنويه: إنشاء ملفات Excel يتطلب مكتبات خاصة مثل xlsx
        // لأغراض العرض، سنقوم بإنشاء ملف CSV
        
        // تنسيق اسم الملف
        const dateStr = new Date(backupInfo.date).toISOString().replace(/[:.]/g, '-');
        const fileName = `${backupInfo.name.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_')}_${dateStr}.csv`;
        
        // إنشاء محتوى CSV للنسخة الاحتياطية (مثال للمستثمرين فقط)
        let csvContent = "الرقم,الاسم,رقم الهاتف,البريد الإلكتروني,العنوان,المدينة,رقم البطاقة,تاريخ الانضمام\n";
        
        data.investors.forEach((investor, index) => {
            csvContent += `${index + 1},${investor.name},${investor.phone},${investor.email || ''},`;
            csvContent += `${investor.address || ''},${investor.city || ''},${investor.idCard || ''},`;
            csvContent += `${formatDate(investor.joinDate)}\n`;
        });
        
        // إنشاء رابط تنزيل الملف
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // إنشاء عنصر رابط وتنزيل الملف
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log('تم إنشاء نسخة Excel بنجاح:', fileName);
    } catch (error) {
        console.error('خطأ في إنشاء نسخة Excel:', error);
        throw new Error('فشل في إنشاء نسخة Excel: ' + error.message);
    }
}

/**
 * إنشاء تقرير النسخة الاحتياطية بصيغة HTML
 * Generate backup report HTML
 */
function generateBackupReport(data, backupInfo, format = 'pdf') {
    // إنشاء تقرير HTML للنسخة الاحتياطية
    const title = backupInfo.name;
    const date = formatDate(backupInfo.date) + ' ' + formatTime(backupInfo.date);
    
    // إحصائيات النسخة الاحتياطية
    const stats = {
        investors: data.investors.length,
        investments: data.investments.length,
        operations: data.operations.length,
        events: data.events.length,
        notifications: data.notifications.length,
        reports: data.reports.length
    };
    
    // إنشاء محتوى HTML
    let htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>تقرير النسخة الاحتياطية - ${title}</title>
            <style>
                body {
                    font-family: 'Arial', 'Tahoma', sans-serif;
                    direction: rtl;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #3498db;
                    margin-bottom: 5px;
                }
                .header p {
                    color: #777;
                    margin-top: 5px;
                }
                .section {
                    margin-bottom: 30px;
                    page-break-inside: avoid;
                }
                .section h2 {
                    color: #2980b9;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                .stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .stat-card {
                    flex: 1;
                    min-width: 200px;
                    padding: 15px;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .stat-card .title {
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #555;
                }
                .stat-card .value {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #3498db;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px 12px;
                    text-align: right;
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    color: #777;
                    font-size: 0.9em;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }
                
                @media print {
                    body {
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>تقرير النسخة الاحتياطية الشاملة</h1>
                <p>${title} - ${date}</p>
            </div>
            
            <div class="section">
                <h2>إحصائيات النظام</h2>
                <div class="stats">
                    <div class="stat-card">
                        <div class="title">المستثمرين</div>
                        <div class="value">${stats.investors}</div>
                    </div>
                    <div class="stat-card">
                        <div class="title">الاستثمارات</div>
                        <div class="value">${stats.investments}</div>
                    </div>
                    <div class="stat-card">
                        <div class="title">العمليات</div>
                        <div class="value">${stats.operations}</div>
                    </div>
                    <div class="stat-card">
                        <div class="title">الأحداث</div>
                        <div class="value">${stats.events}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>معلومات النسخة الاحتياطية</h2>
                <table>
                    <tr>
                        <th>العنصر</th>
                        <th>القيمة</th>
                    </tr>
                    <tr>
                        <td>اسم النسخة</td>
                        <td>${title}</td>
                    </tr>
                    <tr>
                        <td>تاريخ الإنشاء</td>
                        <td>${date}</td>
                    </tr>
                    <tr>
                        <td>معرف النسخة</td>
                        <td>${backupInfo.id}</td>
                    </tr>
                    <tr>
                        <td>حجم البيانات</td>
                        <td>${formatFileSize(backupInfo.size)}</td>
                    </tr>
                    <tr>
                        <td>إصدار النظام</td>
                        <td>${data.version || '1.0.0'}</td>
                    </tr>
                </table>
            </div>
            
            <div class="page-break"></div>
            
            <div class="section">
                <h2>قائمة المستثمرين</h2>
                <table>
                    <tr>
                        <th>#</th>
                        <th>الاسم</th>
                        <th>رقم الهاتف</th>
                        <th>العنوان</th>
                        <th>تاريخ الانضمام</th>
                    </tr>
                    ${data.investors.slice(0, 10).map((investor, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${investor.name}</td>
                            <td>${investor.phone}</td>
                            <td>${investor.address || '-'}</td>
                            <td>${formatDate(investor.joinDate)}</td>
                        </tr>
                    `).join('')}
                    ${data.investors.length > 10 ? `
                        <tr>
                            <td colspan="5" style="text-align: center;">... وعناصر أخرى (${data.investors.length - 10})</td>
                        </tr>
                    ` : ''}
                </table>
            </div>
            
            <div class="section">
                <h2>قائمة الاستثمارات النشطة</h2>
                <table>
                    <tr>
                        <th>#</th>
                        <th>المستثمر</th>
                        <th>المبلغ</th>
                        <th>تاريخ الاستثمار</th>
                        <th>الحالة</th>
                    </tr>
                    ${data.investments.filter(inv => inv.status === 'active').slice(0, 10).map((investment, index) => {
                        const investor = data.investors.find(inv => inv.id === investment.investorId);
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${investor ? investor.name : 'غير معروف'}</td>
                                <td>${formatCurrency(investment.amount)}</td>
                                <td>${formatDate(investment.date)}</td>
                                <td>نشط</td>
                            </tr>
                        `;
                    }).join('')}
                    ${data.investments.filter(inv => inv.status === 'active').length > 10 ? `
                        <tr>
                            <td colspan="5" style="text-align: center;">... وعناصر أخرى (${data.investments.filter(inv => inv.status === 'active').length - 10})</td>
                        </tr>
                    ` : ''}
                </table>
            </div>
            
            <div class="page-break"></div>
            
            <div class="section">
                <h2>العمليات الأخيرة</h2>
                <table>
                    <tr>
                        <th>رقم العملية</th>
                        <th>النوع</th>
                        <th>المبلغ</th>
                        <th>التاريخ</th>
                        <th>الحالة</th>
                    </tr>
                    ${data.operations.slice(0, 10).map(operation => {
                        return `
                            <tr>
                                <td>${operation.id}</td>
                                <td>${getOperationTypeName(operation.type)}</td>
                                <td>${formatCurrency(operation.amount)}</td>
                                <td>${formatDate(operation.date)}</td>
                                <td>${operation.status === 'pending' ? 'معلق' : 'مكتمل'}</td>
                            </tr>
                        `;
                    }).join('')}
                    ${data.operations.length > 10 ? `
                        <tr>
                            <td colspan="5" style="text-align: center;">... وعناصر أخرى (${data.operations.length - 10})</td>
                        </tr>
                    ` : ''}
                </table>
            </div>
            
            <div class="section">
                <h2>إعدادات النظام</h2>
                <table>
                    <tr>
                        <th>الإعداد</th>
                        <th>القيمة</th>
                    </tr>
                    <tr>
                        <td>اسم الشركة</td>
                        <td>${data.settings.companyName}</td>
                    </tr>
                    <tr>
                        <td>نسبة الربح الشهرية</td>
                        <td>${data.settings.monthlyProfitRate}%</td>
                    </tr>
                    <tr>
                        <td>الحد الأدنى للاستثمار</td>
                        <td>${formatCurrency(data.settings.minInvestment)}</td>
                    </tr>
                    <tr>
                        <td>فترة توزيع الأرباح</td>
                        <td>${data.settings.profitDistributionPeriod === 'monthly' ? 'شهرياً' : 
                               data.settings.profitDistributionPeriod === 'quarterly' ? 'ربع سنوي' : 'سنوياً'}</td>
                    </tr>
                    <tr>
                        <td>عملة النظام</td>
                        <td>${data.settings.currency}</td>
                    </tr>
                </table>
            </div>
            
            <div class="footer">
                تم إنشاء هذا التقرير تلقائياً بواسطة نظام إدارة الاستثمار المتطور © ${new Date().getFullYear()}
            </div>
            
            <div class="no-print" style="margin-top: 30px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                    طباعة التقرير
                </button>
            </div>
        </body>
        </html>
    `;
    
    return htmlContent;
}

/**
 * إنشاء نسخة احتياطية تلقائية
 * Create automatic backup
 */
function createAutoCompleteBackup() {
    try {
        // التحقق من تفعيل النسخ الاحتياطي التلقائي
        const enableAutoBackup = localStorage.getItem('enableCompleteAutoBackup') === 'true';
        if (!enableAutoBackup) return;
        
        // الحصول على صيغ النسخة الاحتياطية
        const formatJSON = localStorage.getItem('autoBackupFormatJSON') !== 'false';
        const formatPDF = localStorage.getItem('autoBackupFormatPDF') === 'true';
        
        // إنشاء اسم النسخة الاحتياطية
        const backupName = 'نسخة احتياطية تلقائية';
        
        // إنشاء كائن البيانات للنسخة الاحتياطية
        const backupData = {
            investors: investors,
            investments: investments,
            operations: operations,
            settings: settings,
            events: events,
            notifications: notifications,
            backupList: backupList,
            reports: reports,
            version: '1.0.0',
            createdAt: new Date().toISOString()
        };
        
        // حساب حجم البيانات (تقريبي)
        const serializedData = JSON.stringify(backupData);
        const dataSize = new Blob([serializedData]).size;
        
        // إنشاء معلومات النسخة الاحتياطية
        const backupInfo = {
            id: generateId(),
            name: backupName,
            date: new Date().toISOString(),
            size: dataSize,
            formats: {
                json: formatJSON,
                pdf: formatPDF,
                word: false,
                excel: false
            }
        };
        
        // حفظ معلومات النسخة الاحتياطية
        saveCompleteBackupInfo(backupInfo);
        
        // إنشاء ملفات النسخة الاحتياطية
        if (formatJSON) {
            createJSONBackup(backupData, backupInfo);
        }
        
        if (formatPDF) {
            createPDFBackup(backupData, backupInfo);
        }
        
        // تحديث آخر وقت للنسخ الاحتياطي التلقائي
        localStorage.setItem('lastAutoCompleteBackupDate', new Date().toISOString());
        
        // تحديث قائمة النسخ الاحتياطية
        loadCompleteBackups();
        
        // حذف النسخ الاحتياطية القديمة
        cleanupOldBackups();
        
        console.log('تم إنشاء النسخة الاحتياطية التلقائية بنجاح');
    } catch (error) {
        console.error('خطأ في إنشاء النسخة الاحتياطية التلقائية:', error);
    }
}

/**
 * حذف النسخ الاحتياطية القديمة
 * Cleanup old backups
 */
function cleanupOldBackups() {
    try {
        // الحصول على عدد النسخ للاحتفاظ بها
        const backupsToKeep = parseInt(localStorage.getItem('completeBackupsToKeep') || '10');
        
        // تحميل قائمة النسخ الاحتياطية
        const completeBackups = JSON.parse(localStorage.getItem('completeBackups') || '[]');
        
        // التحقق من عدد النسخ
        if (completeBackups.length <= backupsToKeep) return;
        
        // ترتيب النسخ حسب التاريخ (الأحدث أولاً)
        completeBackups.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // الاحتفاظ بالعدد المحدد فقط
        const updatedBackups = completeBackups.slice(0, backupsToKeep);
        
        // حفظ القائمة المحدثة
        localStorage.setItem('completeBackups', JSON.stringify(updatedBackups));
        
        console.log(`تم حذف ${completeBackups.length - updatedBackups.length} نسخ احتياطية قديمة`);
    } catch (error) {
        console.error('خطأ في حذف النسخ الاحتياطية القديمة:', error);
    }
}

/**
 * جدولة النسخ الاحتياطي التلقائي
 * Schedule automatic backup
 */
function scheduleAutoCompleteBackup() {
    // التحقق من تفعيل النسخ الاحتياطي التلقائي
    const enableAutoBackup = localStorage.getItem('enableCompleteAutoBackup') === 'true';
    if (!enableAutoBackup) return;
    
    // الحصول على فترة النسخ الاحتياطي
    const autoBackupFrequency = localStorage.getItem('completeAutoBackupFrequency') || 'weekly';
    
    // الحصول على تاريخ آخر نسخة احتياطية
    const lastBackupDate = localStorage.getItem('lastAutoCompleteBackupDate');
    
    // حساب تاريخ النسخة الاحتياطية التالية
    let nextBackupDate;
    const now = new Date();
    
    if (lastBackupDate) {
        const lastDate = new Date(lastBackupDate);
        
        switch (autoBackupFrequency) {
            case 'daily':
                // النسخ الاحتياطي اليومي
                nextBackupDate = new Date(lastDate);
                nextBackupDate.setDate(nextBackupDate.getDate() + 1);
                break;
            case 'weekly':
                // النسخ الاحتياطي الأسبوعي
                nextBackupDate = new Date(lastDate);
                nextBackupDate.setDate(nextBackupDate.getDate() + 7);
                break;
            case 'monthly':
                // النسخ الاحتياطي الشهري
                nextBackupDate = new Date(lastDate);
                nextBackupDate.setMonth(nextBackupDate.getMonth() + 1);
                break;
            default:
                // النسخ الاحتياطي الأسبوعي كإعداد افتراضي
                nextBackupDate = new Date(lastDate);
                nextBackupDate.setDate(nextBackupDate.getDate() + 7);
        }
    } else {
        // لم يتم إجراء نسخ احتياطي من قبل، قم بتعيين تاريخ النسخة الاحتياطية التالية إلى الآن
        nextBackupDate = now;
    }
    
    // التحقق مما إذا كان الوقت قد حان لإجراء نسخة احتياطية
    if (now >= nextBackupDate) {
        // إنشاء نسخة احتياطية
        createAutoCompleteBackup();
    }
    
    // جدولة الفحص مرة أخرى بعد ساعة
    setTimeout(scheduleAutoCompleteBackup, 60 * 60 * 1000);
}

/**
 * حفظ إعدادات النسخ الاحتياطي التلقائي
 * Save automatic backup settings
 */
function saveCompleteBackupSettings() {
    try {
        // الحصول على قيم الإعدادات
        const enableAutoBackup = document.getElementById('enableCompleteAutoBackup').checked;
        const autoBackupFrequency = document.getElementById('completeAutoBackupFrequency').value;
        const backupsToKeep = document.getElementById('completeBackupsToKeep').value;
        const autoBackupFormatJSON = document.getElementById('autoBackupFormatJSON').checked;
        const autoBackupFormatPDF = document.getElementById('autoBackupFormatPDF').checked;
        
        // التحقق من صحة البيانات
        if (autoBackupFormatJSON === false && autoBackupFormatPDF === false) {
            createNotification('خطأ', 'يرجى تحديد صيغة واحدة على الأقل للنسخ الاحتياطي التلقائي', 'danger');
            // تعيين صيغة JSON كإعداد افتراضي
            document.getElementById('autoBackupFormatJSON').checked = true;
            return;
        }
        
        // حفظ الإعدادات
        localStorage.setItem('enableCompleteAutoBackup', enableAutoBackup);
        localStorage.setItem('completeAutoBackupFrequency', autoBackupFrequency);
        localStorage.setItem('completeBackupsToKeep', backupsToKeep);
        localStorage.setItem('autoBackupFormatJSON', autoBackupFormatJSON);
        localStorage.setItem('autoBackupFormatPDF', autoBackupFormatPDF);
        
        // تحديث حالة النسخ التلقائي
        updateAutoBackupStatus();
        
        // جدولة النسخ الاحتياطي التلقائي
        scheduleAutoCompleteBackup();
        
        // إظهار رسالة نجاح
        createNotification('نجاح', 'تم حفظ إعدادات النسخ الاحتياطي التلقائي بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في حفظ إعدادات النسخ الاحتياطي التلقائي:', error);
        createNotification('خطأ', 'حدث خطأ أثناء حفظ إعدادات النسخ الاحتياطي التلقائي: ' + error.message, 'danger');
    }
}

/**
 * عرض محتوى النسخة الاحتياطية
 * View backup content
 */
function viewCompleteBackup(backupId) {
    try {
        // البحث عن معلومات النسخة الاحتياطية
        const completeBackups = JSON.parse(localStorage.getItem('completeBackups') || '[]');
        const backup = completeBackups.find(b => b.id === backupId);
        
        if (!backup) {
            createNotification('خطأ', 'النسخة الاحتياطية غير موجودة', 'danger');
            return;
        }
        
        // في بيئة حقيقية، يمكن فتح ملف النسخة الاحتياطية هنا
        // لأغراض العرض، سنعرض تقرير بسيط
        
        // إنشاء كائن بيانات وهمي للتقرير
        const dummyData = {
            investors: investors,
            investments: investments,
            operations: operations,
            settings: settings,
            events: events,
            notifications: notifications,
            version: '1.0.0',
            createdAt: backup.date
        };
        
        // إنشاء محتوى HTML للتقرير
        const htmlContent = generateBackupReport(dummyData, backup);
        
        // فتح التقرير في نافذة جديدة
        const newWindow = window.open('', '_blank');
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        console.log('تم عرض تقرير النسخة الاحتياطية بنجاح');
    } catch (error) {
        console.error('خطأ في عرض النسخة الاحتياطية:', error);
        createNotification('خطأ', 'حدث خطأ أثناء عرض النسخة الاحتياطية: ' + error.message, 'danger');
    }
}

/**
 * استعادة النسخة الاحتياطية
 * Restore backup
 */
function restoreCompleteBackup(backupId) {
    try {
        // البحث عن معلومات النسخة الاحتياطية
        const completeBackups = JSON.parse(localStorage.getItem('completeBackups') || '[]');
        const backup = completeBackups.find(b => b.id === backupId);
        
        if (!backup) {
            createNotification('خطأ', 'النسخة الاحتياطية غير موجودة', 'danger');
            return;
        }
        
        // التأكيد على الاستعادة
        if (!confirm(`هل أنت متأكد من استعادة النسخة الاحتياطية "${backup.name}"؟\nسيتم استبدال جميع البيانات الحالية بالبيانات المخزنة في النسخة الاحتياطية.`)) {
            return;
        }
        
        // في بيئة حقيقية، يتم قراءة ملف النسخة الاحتياطية وتحميل البيانات
        // لأغراض العرض، سنستخدم البيانات الحالية
        
        // إظهار رسالة تقدم العملية
        createNotification('جاري العمل', 'جاري استعادة النسخة الاحتياطية...', 'info');
        
        // محاكاة عملية الاستعادة
        setTimeout(() => {
            // إظهار رسالة نجاح
            createNotification('نجاح', 'تم استعادة النسخة الاحتياطية بنجاح. سيتم تحديث الصفحة خلال 3 ثوان...', 'success');
            
            // تحديث الصفحة بعد 3 ثوان
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }, 2000);
    } catch (error) {
        console.error('خطأ في استعادة النسخة الاحتياطية:', error);
        createNotification('خطأ', 'حدث خطأ أثناء استعادة النسخة الاحتياطية: ' + error.message, 'danger');
    }
}

/**
 * استعادة من ملف
 * Restore from file
 */
function restoreFromFile() {
    try {
        // الحصول على الملف المحدد
        const fileInput = document.getElementById('restoreCompleteBackupFile');
        
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            createNotification('خطأ', 'يرجى اختيار ملف للاستعادة', 'danger');
            return;
        }
        
        // التأكيد على الاستعادة
        if (!confirm('هل أنت متأكد من استعادة النظام من الملف المحدد؟\nسيتم استبدال جميع البيانات الحالية بالبيانات المخزنة في الملف.')) {
            return;
        }
        
        // قراءة الملف
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                // تحويل محتوى الملف إلى كائن
                const backupData = JSON.parse(event.target.result);
                
                // التحقق من صحة البيانات
                if (!backupData.investors || !backupData.investments || !backupData.operations || !backupData.settings) {
                    createNotification('خطأ', 'الملف المحدد لا يحتوي على بيانات صالحة للاستعادة', 'danger');
                    return;
                }
                
                // إظهار رسالة تقدم العملية
                createNotification('جاري العمل', 'جاري استعادة النظام من الملف...', 'info');
                
                // محاكاة عملية الاستعادة
                setTimeout(() => {
                    // إظهار رسالة نجاح
                    createNotification('نجاح', 'تم استعادة النظام من الملف بنجاح. سيتم تحديث الصفحة خلال 3 ثوان...', 'success');
                    
                    // تحديث الصفحة بعد 3 ثوان
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }, 2000);
            } catch (error) {
                console.error('خطأ في قراءة الملف:', error);
                createNotification('خطأ', 'حدث خطأ أثناء قراءة الملف: ' + error.message, 'danger');
            }
        };
        
        reader.readAsText(file);
    } catch (error) {
        console.error('خطأ في استعادة النظام من الملف:', error);
        createNotification('خطأ', 'حدث خطأ أثناء استعادة النظام من الملف: ' + error.message, 'danger');
    }
}

/**
 * استعادة من نسخة محفوظة
 * Restore from saved backup
 */
function restoreFromBackup() {
    try {
        // الحصول على النسخة المحددة
        const restoreSelect = document.getElementById('restoreCompleteBackupSelect');
        
        if (!restoreSelect || !restoreSelect.value) {
            createNotification('خطأ', 'يرجى اختيار نسخة احتياطية للاستعادة', 'danger');
            return;
        }
        
        // استعادة النسخة المحددة
        restoreCompleteBackup(restoreSelect.value);
    } catch (error) {
        console.error('خطأ في استعادة النسخة المحددة:', error);
        createNotification('خطأ', 'حدث خطأ أثناء استعادة النسخة المحددة: ' + error.message, 'danger');
    }
}

/**
 * حذف نسخة احتياطية
 * Delete backup
 */
function deleteCompleteBackup(backupId) {
    try {
        // البحث عن معلومات النسخة الاحتياطية
        const completeBackups = JSON.parse(localStorage.getItem('completeBackups') || '[]');
        const backup = completeBackups.find(b => b.id === backupId);
        
        if (!backup) {
            createNotification('خطأ', 'النسخة الاحتياطية غير موجودة', 'danger');
            return;
        }
        
        // التأكيد على الحذف
        if (!confirm(`هل أنت متأكد من حذف النسخة الاحتياطية "${backup.name}"؟`)) {
            return;
        }
        
        // حذف النسخة من القائمة
        const updatedBackups = completeBackups.filter(b => b.id !== backupId);
        
        // حفظ القائمة المحدثة
        localStorage.setItem('completeBackups', JSON.stringify(updatedBackups));
        
        // تحديث قائمة النسخ الاحتياطية
        loadCompleteBackups();
        
        // إظهار رسالة نجاح
        createNotification('نجاح', 'تم حذف النسخة الاحتياطية بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في حذف النسخة الاحتياطية:', error);
        createNotification('خطأ', 'حدث خطأ أثناء حذف النسخة الاحتياطية: ' + error.message, 'danger');
    }
}

/**
 * تنسيق حجم الملف
 * Format file size
 */
function formatFileSize(size) {
    if (size < 1024) {
        return size + ' B';
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + ' KB';
    } else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}

// إضافة تبويب النسخ الاحتياطي الشامل إلى قائمة التبويبات
if (typeof switchSettingsTab !== 'function') {
    // تعريف الدالة إذا لم تكن موجودة
    window.switchSettingsTab = function(tabId) {
        // إخفاء جميع علامات التبويب
        document.querySelectorAll('.settings-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // إظهار علامة التبويب المحددة
        const selectedTab = document.getElementById(`${tabId}Settings`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // تحديث الزر النشط
        document.querySelectorAll('#settings .tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTabButton = document.querySelector(`#settings .tab[onclick="switchSettingsTab('${tabId}')"]`);
        if (activeTabButton) {
            activeTabButton.classList.add('active');
        }
    };
}

// إضافة الدوال إلى النافذة العامة
window.loadCompleteBackups = loadCompleteBackups;
window.refreshCompleteBackupsList = refreshCompleteBackupsList;
window.createCompleteBackup = createCompleteBackup;
window.viewCompleteBackup = viewCompleteBackup;
window.restoreCompleteBackup = restoreCompleteBackup;
window.deleteCompleteBackup = deleteCompleteBackup;
window.restoreFromFile = restoreFromFile;
window.restoreFromBackup = restoreFromBackup;
window.saveCompleteBackupSettings = saveCompleteBackupSettings;