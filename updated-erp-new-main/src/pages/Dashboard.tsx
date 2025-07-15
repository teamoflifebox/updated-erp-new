import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import StudentDashboard from '../components/Sections/StudentDashboard';
import FacultyDashboard from '../components/Sections/FacultyDashboard';
import AdminDashboard from '../components/Sections/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'hod':
      case 'principal':
      case 'director':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {renderDashboard()}
      </motion.div>
    </Layout>
  );
};

export default Dashboard;