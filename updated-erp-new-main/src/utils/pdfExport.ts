import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
}

class PDFExportService {
  private getDefaultOptions(): Required<ExportOptions> {
    return {
      filename: 'oxford-erp-export',
      title: 'Oxford College ERP',
      subtitle: 'Educational Management System',
      orientation: 'portrait',
      format: 'a4'
    };
  }

  // Export student profile as PDF
  async exportStudentProfile(student: any, options: ExportOptions = {}) {
    const opts = { ...this.getDefaultOptions(), ...options };
    const doc = new jsPDF(opts.orientation, 'pt', opts.format);
    
    // Add header
    this.addHeader(doc, 'Student Profile', student.name);
    
    let yPosition = 120;
    
    // Student basic info
    const basicInfo = [
      ['Name', student.name],
      ['Roll Number', student.rollNumber],
      ['Department', student.department],
      ['Year', student.year],
      ['Email', student.email],
      ['Phone', student.phone],
      ['Date of Birth', student.dateOfBirth],
      ['Blood Group', student.bloodGroup],
      ['Address', student.address]
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Field', 'Information']],
      body: basicInfo,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] },
      margin: { left: 40, right: 40 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 30;

    // Parent information
    const parentInfo = [
      ['Parent Name', student.parentName],
      ['Parent Phone', student.parentPhone],
      ['Parent Email', student.parentEmail],
      ['Parent Occupation', student.parentOccupation],
      ['Emergency Contact', student.emergencyContact]
    ];

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Parent Information', 40, yPosition);
    yPosition += 20;

    autoTable(doc, {
      startY: yPosition,
      head: [['Field', 'Information']],
      body: parentInfo,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 40, right: 40 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 30;

    // Academic information
    const academicInfo = [
      ['CGPA', student.cgpa?.toString() || 'N/A'],
      ['Attendance', `${student.attendance}%` || 'N/A'],
      ['Admission Date', student.admissionDate],
      ['Admission Number', student.admissionNumber],
      ['Category', student.category],
      ['Previous School', student.previousSchool],
      ['Previous Percentage', `${student.previousPercentage}%`],
      ['Entrance Exam', student.entranceExam],
      ['Entrance Rank', student.entranceRank?.toString()]
    ];

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Academic Information', 40, yPosition);
    yPosition += 20;

    autoTable(doc, {
      startY: yPosition,
      head: [['Field', 'Information']],
      body: academicInfo,
      theme: 'grid',
      headStyles: { fillColor: [168, 85, 247] },
      margin: { left: 40, right: 40 }
    });

    // Add footer
    this.addFooter(doc);
    
    // Save the PDF
    doc.save(`${opts.filename}-${student.rollNumber}.pdf`);
  }

  // Export attendance report as PDF
  async exportAttendanceReport(attendanceData: any[], options: ExportOptions = {}) {
    const opts = { ...this.getDefaultOptions(), ...options };
    const doc = new jsPDF(opts.orientation, 'pt', opts.format);
    
    this.addHeader(doc, 'Attendance Report', new Date().toLocaleDateString());
    
    const tableData = attendanceData.map(record => [
      record.name,
      record.rollNumber,
      record.department,
      `${record.attendance}%`,
      record.status
    ]);

    autoTable(doc, {
      startY: 120,
      head: [['Student Name', 'Roll Number', 'Department', 'Attendance', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [14, 165, 233] },
      margin: { left: 40, right: 40 },
      styles: { fontSize: 10 }
    });

    this.addFooter(doc);
    doc.save(`${opts.filename}-attendance-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Export marks report as PDF
  async exportMarksReport(marksData: any[], options: ExportOptions = {}) {
    const opts = { ...this.getDefaultOptions(), ...options };
    const doc = new jsPDF(opts.orientation, 'pt', opts.format);
    
    this.addHeader(doc, 'Marks Report', new Date().toLocaleDateString());
    
    const tableData = marksData.map(record => [
      record.name,
      record.rollNumber,
      record.subject,
      record.examType,
      `${record.marks}/${record.maxMarks}`,
      `${record.percentage.toFixed(1)}%`,
      record.grade
    ]);

    autoTable(doc, {
      startY: 120,
      head: [['Student', 'Roll No.', 'Subject', 'Exam', 'Marks', 'Percentage', 'Grade']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 40, right: 40 },
      styles: { fontSize: 9 }
    });

    this.addFooter(doc);
    doc.save(`${opts.filename}-marks-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Export fee report as PDF
  async exportFeeReport(feeData: any[], options: ExportOptions = {}) {
    const opts = { ...this.getDefaultOptions(), ...options };
    const doc = new jsPDF(opts.orientation, 'pt', opts.format);
    
    this.addHeader(doc, 'Fee Report', new Date().toLocaleDateString());
    
    const tableData = feeData.map(record => [
      record.name,
      record.rollNumber,
      record.department,
      `₹${record.totalFee.toLocaleString()}`,
      `₹${record.paidAmount.toLocaleString()}`,
      `₹${record.pendingAmount.toLocaleString()}`,
      record.status
    ]);

    autoTable(doc, {
      startY: 120,
      head: [['Student', 'Roll No.', 'Department', 'Total Fee', 'Paid', 'Pending', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [168, 85, 247] },
      margin: { left: 40, right: 40 },
      styles: { fontSize: 9 }
    });

    this.addFooter(doc);
    doc.save(`${opts.filename}-fees-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Export timetable as PDF
  async exportTimetable(timetableData: any, options: ExportOptions = {}) {
    const opts = { ...this.getDefaultOptions(), ...options };
    const doc = new jsPDF('landscape', 'pt', opts.format);
    
    this.addHeader(doc, 'Class Timetable', 'Weekly Schedule');
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
      '9:00-10:00',
      '10:00-11:00',
      '11:15-12:15',
      '12:15-1:15',
      '2:00-3:00',
      '3:00-4:00',
      '4:15-5:15',
      '5:15-6:15'
    ];

    const tableData = timeSlots.map(timeSlot => {
      const row = [timeSlot];
      days.forEach(day => {
        const dayData = timetableData[day] || [];
        const timeIndex = timeSlots.indexOf(timeSlot);
        const classData = dayData[timeIndex];
        
        if (classData && classData.subject) {
          row.push(`${classData.subject}\n${classData.faculty || classData.class || ''}\n${classData.room || classData.location || ''}`);
        } else {
          row.push('Free');
        }
      });
      return row;
    });

    autoTable(doc, {
      startY: 120,
      head: [['Time', ...days]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] },
      margin: { left: 40, right: 40 },
      styles: { fontSize: 8, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 110 },
        2: { cellWidth: 110 },
        3: { cellWidth: 110 },
        4: { cellWidth: 110 },
        5: { cellWidth: 110 },
        6: { cellWidth: 110 }
      }
    });

    this.addFooter(doc);
    doc.save(`${opts.filename}-timetable-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Export analytics report as PDF
  async exportAnalyticsReport(analyticsData: any, options: ExportOptions = {}) {
    const opts = { ...this.getDefaultOptions(), ...options };
    const doc = new jsPDF(opts.orientation, 'pt', opts.format);
    
    this.addHeader(doc, 'Analytics Report', new Date().toLocaleDateString());
    
    let yPosition = 120;

    // Summary statistics
    const summaryData = [
      ['Total Students', analyticsData.totalStudents?.toString() || 'N/A'],
      ['Total Faculty', analyticsData.totalFaculty?.toString() || 'N/A'],
      ['Overall Attendance', `${analyticsData.overallAttendance || 0}%`],
      ['Average CGPA', analyticsData.averageCGPA?.toString() || 'N/A'],
      ['Fee Collection Rate', `${analyticsData.feeCollectionRate || 0}%`],
      ['Placement Rate', `${analyticsData.placementRate || 0}%`]
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] },
      margin: { left: 40, right: 40 }
    });

    this.addFooter(doc);
    doc.save(`${opts.filename}-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Export any HTML element as PDF
  async exportElementAsPDF(elementId: string, options: ExportOptions = {}) {
    const opts = { ...this.getDefaultOptions(), ...options };
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF(opts.orientation, 'pt', opts.format);
      
      const imgWidth = doc.internal.pageSize.getWidth() - 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      this.addHeader(doc, opts.title, opts.subtitle);
      doc.addImage(imgData, 'PNG', 40, 120, imgWidth, imgHeight);
      this.addFooter(doc);
      
      doc.save(`${opts.filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  private addHeader(doc: jsPDF, title: string, subtitle: string) {
    // Add logo/header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 165, 233);
    doc.text('Oxford College ERP', 40, 40);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Technology Excellence', 40, 55);
    
    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(title, 40, 85);
    
    if (subtitle) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(subtitle, 40, 105);
    }
    
    // Add line
    doc.setDrawColor(200, 200, 200);
    doc.line(40, 110, doc.internal.pageSize.getWidth() - 40, 110);
  }

  private addFooter(doc: jsPDF) {
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add line
    doc.setDrawColor(200, 200, 200);
    doc.line(40, pageHeight - 60, pageWidth - 40, pageHeight - 60);
    
    // Add footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by Oxford College ERP System', 40, pageHeight - 40);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, pageHeight - 25);
    
    // Add page number
    doc.text(`Page 1`, pageWidth - 80, pageHeight - 40);
  }
}

export const pdfExportService = new PDFExportService();