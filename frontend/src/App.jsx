// src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout';
import {
  Login,
  Home,
  CourseDetails,
  Cart,
  Payment,
  MinhasAulas,
  Profile,
  AddAulas
  ,
} from './pages';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Login />} />

          {/* Rotas protegidas para alunos e chefes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={['aluno', 'chefe']}>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/:id"
            element={
              <ProtectedRoute allowedRoles={['aluno', 'chefe']}>
                <AppLayout>
                  <CourseDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['aluno']}>
                <AppLayout>
                  <Cart />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={['aluno']}>
                <AppLayout>
                  <Payment />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/minhas-aulas"
            element={
              <ProtectedRoute allowedRoles={['aluno']}>
                <AppLayout>
                  <MinhasAulas />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Rota para Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['aluno', 'chefe']}>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Nova rota para AddAula, acessível apenas a chefes */}
          <Route
            path="/add-aula"
            element={
              <ProtectedRoute allowedRoles={['chefe']}>
                <AppLayout>
                  <AddAulas />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
