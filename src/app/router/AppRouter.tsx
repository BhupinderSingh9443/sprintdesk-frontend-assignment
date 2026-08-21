import {
    lazy,
    Suspense,
} from 'react';

import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import {
    ProtectedRoute,
} from './ProtectedRoute';

import {
    PublicOnlyRoute,
} from './PublicOnlyRoute';

import {
    FullScreenLoader,
} from '../../components/ui/FullScreenLoader';

import {
    useAuthBootstrap,
} from '../../features/auth/useAuthBootstrap';

const LoginPage =
    lazy(() => import('../../pages/LoginPage'));

const DashboardPage =
    lazy(() => import('../../pages/DashboardPage'));

const BoardPage =
    lazy(() => import('../../pages/BoardPage'));

const AnalyticsPage =
    lazy(() => import('../../pages/AnalyticsPage'));
const AppLayout =
    lazy(() => import('../../layouts/AppLayout'));

export function AppRouter() {
    useAuthBootstrap();

    return (
        <BrowserRouter>
            <Suspense fallback={<FullScreenLoader />}>
                <Routes>

                    <Route element={<PublicOnlyRoute />}>
                        <Route
                            path="/login"
                            element={<LoginPage />}
                        />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />

                            <Route
                                path="/board"
                                element={<BoardPage />}
                            />

                            <Route
                                path="/analytics"
                                element={<AnalyticsPage />}
                            />
                        </Route>
                    </Route>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}