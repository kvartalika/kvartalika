import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore} from "../../store/auth.store.ts";
import ContentManagementSection from "./ContentManagementSection.tsx";

const ContentManagementPage = () => {
  const {role, isAuthenticated} = useAuthStore();
  const navigate = useNavigate();

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
    <div className="mt-16 p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Управление контентом</h1>
      <ContentManagementSection />
    </div>
  );
};

export default ContentManagementPage;