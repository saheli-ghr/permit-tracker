                row.innerHTML = `
                    <td>${emp.fullName}</td>
                    <td>${emp.employeeId}</td>
                    <td>${emp.nationality}</td>
                    <td>${emp.hostCountry}</td>
                    <td>${emp.visaType}</td>
                    <td>${emp.visaExpiryDate}</td>
                    <td><span class="days-expiry ${getDaysClass(daysToExpiry)}">${daysToExpiry} days</span></td>
                    <td><span class="status-badge ${getStatusClass(daysToExpiry)}">${emp.currentStatus}</span></td>
                    <td><span class="status-badge priority-${emp.priorityLevel.toLowerCase()}">${emp.priorityLevel}</span></td>
                    <td><span class="risk-flag risk-${emp.complianceRisk.toLowerCase()}">${emp.complianceRisk}</span></td>
                    <td>
                        <button onclick="editRecord(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">✏️ Edit</button>
                        <button onclick="deleteRecord(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: #dc3545; margin-left: 0.25rem;">🗑️</button>
                    </td>
                `;
            });
        }

        function toggleAddForm() {
            const form = document.getElementById('addRecordForm');
            form.classList.toggle('active');
        }

        function cancelAdd() {
            document.getElementById('addRecordForm').classList.remove('active');
            // Clear form fields
            document.querySelectorAll('#addRecordForm input, #addRecordForm select').forEach(field => {
                field.value = '';
            });
        }

        function addRecord() {
            // Validate required fields
            const requiredFields = ['fullName', 'employeeId', 'visaExpiryDate'];
            let isValid = true;
            
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e9ecef';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Create new record
            const newRecord = {
                fullName: document.getElementById('fullName').value,
                employeeId: document.getElementById('employeeId').value,
                nationality: document.getElementById('nationality').value,
                homeCountry: document.getElementById('homeCountry').value,
                hostCountry: document.getElementById('hostCountry').value,
                currentLocation: document.getElementById('currentLocation').value,
                businessUnit: document.getElementById('businessUnit').value,
                lineManager: document.getElementById('lineManager').value,
                immigrationCategory: document.getElementById('immigrationCategory').value,
                visaType: document.getElementById('visaType').value,
                sponsoringEntity: document.getElementById('sponsoringEntity').value,
                visaStartDate: document.getElementById('visaStartDate').value,
                visaExpiryDate: document.getElementById('visaExpiryDate').value,
                currentStatus: document.getElementById('currentStatus').value,
                priorityLevel: document.getElementById('priorityLevel').value,
                complianceRisk: "No" // Default to No, can be updated later
            };
            
            // Add to data array
            visaData.push(newRecord);
            
            // Update UI
            if (currentTab === 'tracker') {
                populateTable();
                populateCountryFilter();
            }
            updateDashboard();
            
            // Close and reset form
            cancelAdd();
            
            // Show success message
            alert('Record added successfully!');
        }

        function editRecord(index) {
            const emp = visaData[index];
            // Populate form with record data
            document.getElementById('fullName').value = emp.fullName;
            document.getElementById('employeeId').value = emp.employeeId;
            document.getElementById('nationality').value = emp.nationality;
            document.getElementById('homeCountry').value = emp.homeCountry;
            document.getElementById('hostCountry').value = emp.hostCountry;
            document.getElementById('currentLocation').value = emp.currentLocation;
            document.getElementById('businessUnit').value = emp.businessUnit;
            document.getElementById('lineManager').value = emp.lineManager;
            document.getElementById('immigrationCategory').value = emp.immigrationCategory;
            document.getElementById('visaType').value = emp.visaType;
            document.getElementById('sponsoringEntity').value = emp.sponsoringEntity;
            document.getElementById('visaStartDate').value = emp.visaStartDate;
            document.getElementById('visaExpiryDate').value = emp.visaExpiryDate;
            document.getElementById('currentStatus').value = emp.currentStatus;
            document.getElementById('priorityLevel').value = emp.priorityLevel;
            
            // Show form
            document.getElementById('addRecordForm').classList.add('active');
            
            // Change save button to update
            const saveButton = document.querySelector('#addRecordForm button:first-child');
            saveButton.textContent = '💾 Update Record';
            saveButton.onclick = function() { updateRecord(index); };
        }

        function updateRecord(index) {
            // Update record in array
            visaData[index] = {
                fullName: document.getElementById('fullName').value,
                employeeId: document.getElementById('employeeId').value,
                nationality: document.getElementById('nationality').value,
                homeCountry: document.getElementById('homeCountry').value,
                hostCountry: document.getElementById('hostCountry').value,
                currentLocation: document.getElementById('currentLocation').value,
                businessUnit: document.getElementById('businessUnit').value,
                lineManager: document.getElementById('lineManager').value,
                immigrationCategory: document.getElementById('immigrationCategory').value,
                visaType: document.getElementById('visaType').value,
                sponsoringEntity: document.getElementById('sponsoringEntity').value,
                visaStartDate: document.getElementById('visaStartDate').value,
                visaExpiryDate: document.getElementById('visaExpiryDate').value,
                currentStatus: document.getElementById('currentStatus').value,
                priorityLevel: document.getElementById('priorityLevel').value,
                complianceRisk: visaData[index].complianceRisk // Preserve existing risk value
            };
            
            // Update UI
            if (currentTab === 'tracker') {
                populateTable();
            }
            updateDashboard();
            
            // Close and reset form
            cancelAdd();
            
            // Reset save button
            const saveButton = document.querySelector('#addRecordForm button:first-child');
            saveButton.textContent = '💾 Save Record';
            saveButton.onclick = function() { addRecord(); };
            
            // Show success message
            alert('Record updated successfully!');
        }

        function deleteRecord(index) {
            if (confirm('Are you sure you want to delete this record?')) {
                visaData.splice(index, 1);
                
                // Update UI
                if (currentTab === 'tracker') {
                    populateTable();
                    populateCountryFilter();
                }
                updateDashboard();
                
                // Show success message
                alert('Record deleted successfully!');
            }
        }

        function updateAlerts() {
            const alerts30 = visaData.filter(emp => {
                const days = calculateDaysToExpiry(emp.visaExpiryDate);
                return days <= 30 && days >= 0;
            }).length;
            
            const alerts60 = visaData.filter(emp => {
                const days = calculateDaysToExpiry(emp.visaExpiryDate);
                return days <= 60 && days > 30;
            }).length;
            
            const alerts90 = visaData.filter(emp => {
                const days = calculateDaysToExpiry(emp.visaExpiryDate);
                return days <= 90 && days > 60;
            }).length;
            
            document.getElementById('alerts30').textContent = alerts30;
            document.getElementById('alerts60').textContent = alerts60;
            document.getElementById('alerts90').textContent = alerts90;
            
            // Populate alerts list
            const alertsList = document.getElementById('alertsList');
            alertsList.innerHTML = '';
            
            // Critical alerts (<= 30 days)
            const criticalAlerts = visaData.filter(emp => {
                const days = calculateDaysToExpiry(emp.visaExpiryDate);
                return days <= 30 && days >= 0;
            });
            
            if (criticalAlerts.length > 0) {
                const criticalSection = document.createElement('div');
                criticalSection.className = 'alert alert-danger';
                criticalSection.innerHTML = '<h3>⚠️ Critical Alerts (Expiring within 30 days)</h3>';
                
                const ul = document.createElement('ul');
                criticalAlerts.forEach(emp => {
                    const days = calculateDaysToExpiry(emp.visaExpiryDate);
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${emp.fullName}</strong> (${emp.employeeId}) - ${emp.visaType} for ${emp.hostCountry} expires in ${days} days (${emp.visaExpiryDate})`;
                    ul.appendChild(li);
                });
                
                criticalSection.appendChild(ul);
                alertsList.appendChild(criticalSection);
            }
            
            // Warning alerts (31-60 days)
            const warningAlerts = visaData.filter(emp => {
                const days = calculateDaysToExpiry(emp.visaExpiryDate);
                return days <= 60 && days > 30;
            });
            
            if (warningAlerts.length > 0) {
                const warningSection = document.createElement('div');
                warningSection.className = 'alert alert-warning';
                warningSection.innerHTML = '<h3>⚠️ Warning Alerts (Expiring within 31-60 days)</h3>';
                
                const ul = document.createElement('ul');
                warningAlerts.forEach(emp => {
                    const days = calculateDaysToExpiry(emp.visaExpiryDate);
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${emp.fullName}</strong> (${emp.employeeId}) - ${emp.visaType} for ${emp.hostCountry} expires in ${days} days (${emp.visaExpiryDate})`;
                    ul.appendChild(li);
                });
                
                warningSection.appendChild(ul);
                alertsList.appendChild(warningSection);
            }
            
            // Info alerts (61-90 days)
            const infoAlerts = visaData.filter(emp => {
                const days = calculateDaysToExpiry(emp.visaExpiryDate);
                return days <= 90 && days > 60;
            });
            
            if (infoAlerts.length > 0) {
                const infoSection = document.createElement('div');
                infoSection.className = 'alert alert-success';
                infoSection.innerHTML = '<h3>ℹ️ Information Alerts (Expiring within 61-90 days)</h3>';
                
                const ul = document.createElement('ul');
                infoAlerts.forEach(emp => {
                    const days = calculateDaysToExpiry(emp.visaExpiryDate);
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${emp.fullName}</strong> (${emp.employeeId}) - ${emp.visaType} for ${emp.hostCountry} expires in ${days} days (${emp.visaExpiryDate})`;
                    ul.appendChild(li);
                });
                
                infoSection.appendChild(ul);
                alertsList.appendChild(infoSection);
            }
        }

        function exportToCSV() {
            let csv = 'Full Name,Employee ID,Nationality,Host Country,Visa Type,Visa Start Date,Visa Expiry Date,Status,Priority,Compliance Risk\n';
            
            visaData.forEach(emp => {
                csv += `"${emp.fullName}","${emp.employeeId}","${emp.nationality}","${emp.hostCountry}","${emp.visaType}","${emp.visaStartDate}","${emp.visaExpiryDate}","${emp.currentStatus}","${emp.priorityLevel}","${emp.complianceRisk}"\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'visa_tracker_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function generateReport() {
            const reportType = document.getElementById('reportType').value;
            const startDate = document.getElementById('reportStartDate').value;
            const endDate = document.getElementById('reportEndDate').value;
            
            const reportOutput = document.getElementById('reportOutput');
            reportOutput.style.display = 'block';
            reportOutput.innerHTML = '<h3>Generating report...</h3>';
            
            // Simulate report generation
            setTimeout(() => {
                let reportContent = '';
                
                if (reportType === 'expiry') {
                    reportContent = generateExpiryReport(startDate, endDate);
                } else if (reportType === 'country') {
                    reportContent = generateCountryReport();
                } else if (reportType === 'risk') {
                    reportContent = generateRiskReport();
                } else {
                    reportContent = generateAuditReport();
                }
                
                reportOutput.innerHTML = reportContent;
            }, 1000);
        }

        function generateExpiryReport(startDate, endDate) {
            let report = '<h3>Visa Expiry Report</h3>';
            
            // Count by status
            const statusCounts = {
                Active: 0,
                Expiring: 0,
                Expired: 0,
                Renewed: 0
            };
            
            visaData.forEach(emp => {
                statusCounts[emp.currentStatus]++;
            });
            
            report += '<h4>Status Overview</h4>';
            report += '<ul>';
            for (const [status, count] of Object.entries(statusCounts)) {
                report += `<li>${status}: ${count} employees</li>`;
            }
            report += '</ul>';
            
            // Expiring soon
            const expiringSoon = visaData.filter(emp => {
                const days = calculateDaysToExpiry(emp.visaExpiryDate);
                return days <= 90 && days >= 0;
            });
            
            if (expiringSoon.length > 0) {
                report += '<h4>Employees with Visas Expiring Soon (within 90 days)</h4>';
                report += '<table class="report-table"><tr><th>Employee</th><th>ID</th><th>Host Country</th><th>Visa Type</th><th>Expiry Date</th><th>Days Remaining</th></tr>';
                
                expiringSoon.forEach(emp => {
                    const days = calculateDaysToExpiry(emp.visaExpiryDate);
                    report += `<tr>
                        <td>${emp.fullName}</td>
                        <td>${emp.employeeId}</td>
                        <td>${emp.hostCountry}</td>
                        <td>${emp.visaType}</td>
                        <td>${emp.visaExpiryDate}</td>
                        <td>${days}</td>
                    </tr>`;
                });
                
                report += '</table>';
            }
            
            return report;
        }

        function generateCountryReport() {
            let report = '<h3>Country Distribution Report</h3>';
            
            // Group by host country
            const countryMap = {};
            
            visaData.forEach(emp => {
                if (!countryMap[emp.hostCountry]) {
                    countryMap[emp.hostCountry] = [];
                }
                countryMap[emp.hostCountry].push(emp);
            });
            
            report += '<h4>Employees by Host Country</h4>';
            report += '<ul>';
            for (const [country, employees] of Object.entries(countryMap)) {
                report += `<li>${country}: ${employees.length} employees</li>`;
            }
            report += '</ul>';
            
            // Detailed breakdown
            report += '<h4>Detailed Breakdown</h4>';
            for (const [country, employees] of Object.entries(countryMap)) {
                report += `<h5>${country}</h5>`;
                report += '<table class="report-table"><tr><th>Employee</th><th>ID</th><th>Visa Type</th><th>Expiry Date</th><th>Status</th></tr>';
                
                employees.forEach(emp => {
                    report += `<tr>
                        <td>${emp.fullName}</td>
                        <td>${emp.employeeId}</td>
                        <td>${emp.visaType}</td>
                        <td>${emp.visaExpiryDate}</td>
                        <td>${emp.currentStatus}</td>
                    </tr>`;
                });
                
                report += '</table>';
            }
            
            return report;
        }

        function generateRiskReport() {
            let report = '<h3>Risk Assessment Report</h3>';
            
            // High risk cases
            const highRisk = visaData.filter(emp => emp.priorityLevel === 'High' || emp.complianceRisk === 'Yes');
            
            if (highRisk.length > 0) {
                report += '<h4>High Risk Cases</h4>';
                report += '<table class="report-table"><tr><th>Employee</th><th>ID</th><th>Host Country</th><th>Visa Type</th><th>Expiry Date</th><th>Priority</th><th>Risk Flag</th></tr>';
                
                highRisk.forEach(emp => {
                    report += `<tr>
                        <td>${emp.fullName}</td>
                        <td>${emp.employeeId}</td>
                        <td>${emp.hostCountry}</td>
                        <td>${emp.visaType}</td>
                        <td>${emp.visaExpiryDate}</td>
                        <td>${emp.priorityLevel}</td>
                        <td>${emp.complianceRisk}</td>
                    </tr>`;
                });
                
                report += '</table>';
            }
            
            // Medium risk cases
            const mediumRisk = visaData.filter(emp => emp.priorityLevel === 'Medium' && emp.complianceRisk === 'No');
            
            if (mediumRisk.length > 0) {
                report += '<h4>Medium Risk Cases</h4>';
                report += '<table class="report-table"><tr><th>Employee</th><th>ID</th><th>Host Country</th><th>Visa Type</th><th>Expiry Date</th></tr>';
                
                mediumRisk.forEach(emp => {
                    report += `<tr>
                        <td>${emp.fullName}</td>
                        <td>${emp.employeeId}</td>
                        <td>${emp.hostCountry}</td>
                        <td>${emp.visaType}</td>
                        <td>${emp.visaExpiryDate}</td>
                    </tr>`;
                });
                
                report += '</table>';
            }
            
            return report;
        }

        function generateAuditReport() {
            let report = '<h3>System Audit Report</h3>';
            report += '<p>Last updated: ' + new Date().toLocaleString() + '</p>';
            
            report += '<h4>System Summary</h4>';
            report += '<ul>';
            report += `<li>Total records: ${visaData.length}</li>`;
            
            const statusCounts = {
                Active: 0,
                Expiring: 0,
                Expired: 0,
                Renewed: 0
            };
            
            visaData.forEach(emp => {
                statusCounts[emp.currentStatus]++;
            });
            
            for (const [status, count] of Object.entries(statusCounts)) {
                report += `<li>${status} visas: ${count}</li>`;
            }
            
            report += '</ul>';
            
            return report;
        }

        function saveSettings() {
            const alert90 = document.getElementById('alert90').value;
            const alert60 = document.getElementById('alert60').value;
            const alert30 = document.getElementById('alert30').value;
            const defaultPriority = document.getElementById('defaultPriority').value;
            const exportSchedule = document.getElementById('exportSchedule').value;
            
            // In a real app, you would save these to localStorage or a server
            alert('Settings saved successfully!');
        }

        function resetData() {
            if (confirm('WARNING: This will delete ALL data. Are you sure?')) {
                visaData = [];
                
                // Update UI
                if (currentTab === 'tracker') {
                    populateTable();
                    populateCountryFilter();
                }
                updateDashboard();
                updateAlerts();
                
                alert('All data has been reset.');
            }
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            updateDashboard();
            populateTable();
            populateCountryFilter();
        });
    </script>
</body>
</html>
