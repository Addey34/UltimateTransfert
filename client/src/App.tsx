import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthCallback from './components/auth/AuthCallback';
import DropZone from './components/file/DropZone';
import FileList from './components/file/FileList';
import Header from './components/ui/Header';
import { AuthProvider } from './context/AuthContext';
import { FileProvider } from './context/FileContext';

function App() {
  return (
    <AuthProvider>
      <FileProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                <Header />
                <Routes>
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route
                    path="/"
                    element={
                      <div className="space-y-8">
                        <DropZone />
                        <FileList />
                      </div>
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </FileProvider>
    </AuthProvider>
  );
}

export default App;
