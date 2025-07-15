import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap,
  Users,
  Heart,
  Award,
  BookOpen,
  Download,
  Printer,
  AlertCircle,
  CreditCard,
  CheckCircle,
  Clock
} from 'lucide-react';
import { pdfExportService } from '../../utils/pdfExport';

interface StudentProfileModalProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  const handleExportPDF = async () => {
    try {
      await pdfExportService.exportStudentProfile(student, {
        filename: `student-profile-${student.rollNumber}`,
        title: 'Student Profile Report',
        subtitle: `${student.name} - ${student.rollNumber}`
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('student-profile-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Student Profile - ${student.name}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; }
                .section { margin-bottom: 25px; }
                .section-title { font-size: 18px; font-weight: bold; color: #0ea5e9; margin-bottom: 15px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .info-item { margin-bottom: 8px; }
                .label { font-weight: bold; color: #374151; }
                .value { color: #6b7280; }
                .achievements { list-style: none; padding: 0; }
                .achievements li { background: #f3f4f6; padding: 8px; margin: 5px 0; border-radius: 5px; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Oxford College ERP</h1>
                <h2>Student Profile Report</h2>
                <p>${student.name} - ${student.rollNumber}</p>
              </div>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const getFeeStatusColor = (status: any) => {
    if (!status) return 'text-gray-600 bg-gray-100';
    if (status.pendingAmount === 0) return 'text-green-600 bg-green-100';
    if (status.pendingAmount > 0) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getComplaintStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white"
              />
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-primary-100">{student.rollNumber}</p>
                <p className="text-primary-200 text-sm">{student.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportPDF}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                title="Export as PDF"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handlePrint}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                title="Print Profile"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div id="student-profile-content">
            {/* Print Header (hidden on screen) */}
            <div className="header hidden print:block">
              <h1>Oxford College ERP</h1>
              <h2>Student Profile Report</h2>
              <p>{student.name} - {student.rollNumber}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-primary-600 font-medium">CGPA</p>
                    <p className="text-2xl font-bold text-primary-700">{student.cgpa}</p>
                  </div>
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 font-medium">Attendance</p>
                    <p className="text-2xl font-bold text-green-700">{student.attendance}%</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className={`rounded-xl p-4 border ${student.feeStatus?.pendingAmount === 0 ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-medium ${student.feeStatus?.pendingAmount === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                      Fee Status
                    </p>
                    <p className={`text-2xl font-bold ${student.feeStatus?.pendingAmount === 0 ? 'text-green-700' : 'text-yellow-700'}`}>
                      {student.feeStatus?.pendingAmount === 0 ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${student.feeStatus?.pendingAmount === 0 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <CreditCard className={`w-5 h-5 ${student.feeStatus?.pendingAmount === 0 ? 'text-green-600' : 'text-yellow-600'}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="section">
                <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                  <User className="w-5 h-5 text-primary-600" />
                  <span>Personal Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Full Name:</span>
                    <span className="value text-sm text-gray-900">{student.name}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Roll Number:</span>
                    <span className="value text-sm text-gray-900">{student.rollNumber}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Date of Birth:</span>
                    <span className="value text-sm text-gray-900">{student.dateOfBirth}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Gender:</span>
                    <span className="value text-sm text-gray-900">{student.gender}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Blood Group:</span>
                    <span className="value text-sm text-gray-900">{student.bloodGroup}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Nationality:</span>
                    <span className="value text-sm text-gray-900">{student.nationality}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Religion:</span>
                    <span className="value text-sm text-gray-900">{student.religion}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="section">
                <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                  <Mail className="w-5 h-5 text-primary-600" />
                  <span>Contact Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Email:</span>
                    <span className="value text-sm text-gray-900">{student.email}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Phone:</span>
                    <span className="value text-sm text-gray-900">{student.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="label text-sm font-medium text-gray-600">Address:</span>
                    <p className="value text-sm text-gray-900 mt-1">{student.address}</p>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Emergency Contact:</span>
                    <span className="value text-sm text-gray-900">{student.emergencyContact}</span>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="section">
                <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  <span>Academic Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Department:</span>
                    <span className="value text-sm text-gray-900">{student.department}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Year:</span>
                    <span className="value text-sm text-gray-900">{student.year}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Semester:</span>
                    <span className="value text-sm text-gray-900">{student.semester}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Section:</span>
                    <span className="value text-sm text-gray-900">{student.section}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">CGPA:</span>
                    <span className="value text-sm font-weight-bold text-primary-600">{student.cgpa}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Attendance:</span>
                    <span className={`value text-sm font-weight-bold ${student.attendance >= 85 ? 'text-green-600' : student.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {student.attendance}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div className="section">
                <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                  <Users className="w-5 h-5 text-primary-600" />
                  <span>Parent Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Parent Name:</span>
                    <span className="value text-sm text-gray-900">{student.parentName}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Parent Phone:</span>
                    <span className="value text-sm text-gray-900">{student.parentPhone}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Parent Email:</span>
                    <span className="value text-sm text-gray-900">{student.parentEmail}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Parent Occupation:</span>
                    <span className="value text-sm text-gray-900">{student.parentOccupation}</span>
                  </div>
                </div>
              </div>

              {/* Fee Information */}
              {student.feeStatus && (
                <div className="section">
                  <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <span>Fee Information</span>
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="info-item">
                        <span className="label text-sm font-medium text-gray-600">Total Fee:</span>
                        <p className="value text-sm font-medium text-gray-900">₹{student.feeStatus.totalFee.toLocaleString()}</p>
                      </div>
                      <div className="info-item">
                        <span className="label text-sm font-medium text-gray-600">Paid Amount:</span>
                        <p className="value text-sm font-medium text-green-600">₹{student.feeStatus.paidAmount.toLocaleString()}</p>
                      </div>
                      <div className="info-item">
                        <span className="label text-sm font-medium text-gray-600">Pending Amount:</span>
                        <p className="value text-sm font-medium text-red-600">₹{student.feeStatus.pendingAmount.toLocaleString()}</p>
                      </div>
                      <div className="info-item">
                        <span className="label text-sm font-medium text-gray-600">Due Date:</span>
                        <p className="value text-sm text-gray-900">{student.feeStatus.dueDate}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="label text-sm font-medium text-gray-600">Last Payment:</span>
                      <p className="value text-sm text-gray-900">{student.feeStatus.lastPaymentDate}</p>
                    </div>
                    <div className="mt-3">
                      <span className="label text-sm font-medium text-gray-600">Status:</span>
                      <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getFeeStatusColor(student.feeStatus)}`}>
                        {student.feeStatus.pendingAmount === 0 ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            <span>Fully Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Payment Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Complaints */}
              {student.complaints && student.complaints.length > 0 && (
                <div className="section">
                  <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                    <AlertCircle className="w-5 h-5 text-primary-600" />
                    <span>Complaints & Issues</span>
                  </h3>
                  <div className="space-y-3">
                    {student.complaints.map((complaint: any) => (
                      <div key={complaint.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{complaint.issue}</p>
                            <p className="text-xs text-gray-600">Reported on: {complaint.date}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getComplaintStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admission Details */}
              <div className="section">
                <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <span>Admission Details</span>
                </h3>
                <div className="space-y-3">
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Admission Date:</span>
                    <span className="value text-sm text-gray-900">{student.admissionDate}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Admission Number:</span>
                    <span className="value text-sm text-gray-900">{student.admissionNumber}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Category:</span>
                    <span className="value text-sm text-gray-900">{student.category}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Previous School:</span>
                    <span className="value text-sm text-gray-900">{student.previousSchool}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Previous Percentage:</span>
                    <span className="value text-sm text-gray-900">{student.previousPercentage}%</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Entrance Exam:</span>
                    <span className="value text-sm text-gray-900">{student.entranceExam}</span>
                  </div>
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Entrance Rank:</span>
                    <span className="value text-sm text-gray-900">{student.entranceRank}</span>
                  </div>
                </div>
              </div>

              {/* Hostel & Transport */}
              <div className="section">
                <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <span>Hostel & Transport</span>
                </h3>
                <div className="space-y-3">
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Hostel Resident:</span>
                    <span className="value text-sm text-gray-900">{student.hostelResident ? 'Yes' : 'No'}</span>
                  </div>
                  {student.hostelResident && (
                    <>
                      <div className="info-item flex justify-between">
                        <span className="label text-sm font-medium text-gray-600">Hostel Block:</span>
                        <span className="value text-sm text-gray-900">{student.hostelBlock}</span>
                      </div>
                      <div className="info-item flex justify-between">
                        <span className="label text-sm font-medium text-gray-600">Room Number:</span>
                        <span className="value text-sm text-gray-900">{student.roomNumber}</span>
                      </div>
                    </>
                  )}
                  <div className="info-item flex justify-between">
                    <span className="label text-sm font-medium text-gray-600">Transport Mode:</span>
                    <span className="value text-sm text-gray-900">{student.transportMode}</span>
                  </div>
                  {student.busRoute && (
                    <div className="info-item flex justify-between">
                      <span className="label text-sm font-medium text-gray-600">Bus Route:</span>
                      <span className="value text-sm text-gray-900">{student.busRoute}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scholarships */}
            {student.scholarships && student.scholarships.length > 0 && (
              <div className="section mt-8">
                <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                  <Award className="w-5 h-5 text-primary-600" />
                  <span>Scholarships & Awards</span>
                </h3>
                <div className="achievements grid grid-cols-1 md:grid-cols-2 gap-3">
                  {student.scholarships.map((scholarship: string, index: number) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">{scholarship}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medical Information */}
            <div className="section mt-8">
              <h3 className="section-title flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                <Heart className="w-5 h-5 text-primary-600" />
                <span>Medical Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="info-item">
                  <span className="label text-sm font-medium text-gray-600">Medical Conditions:</span>
                  <p className="value text-sm text-gray-900 mt-1">{student.medicalConditions || 'None'}</p>
                </div>
                <div className="info-item">
                  <span className="label text-sm font-medium text-gray-600">Allergies:</span>
                  <p className="value text-sm text-gray-900 mt-1">{student.allergies || 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProfileModal;