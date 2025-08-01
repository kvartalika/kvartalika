import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore} from "../../store";
import ContentManagementSection from "./ContentManagementSection.tsx";

const ContentManagementPage = () => {
  const {role, isAuthenticated} = useAuthStore();
  const navigate = useNavigate();

  console.log('ContentPage render', {isAuthenticated, role});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else if (role === 'CLIENT' || !role) {
      navigate('/');
    }
  }, [isAuthenticated, role, navigate]);

  if (!isAuthenticated || !role || role === 'CLIENT') {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Управление контентом</h1>
      <ContentManagementSection />
    </div>
  );
};

export default ContentManagementPage;