import { Route, Routes } from 'react-router-dom';
import Chat from '../components/dashboard/Chat';
import FivemOverview from '../components/dashboard/FivemOverview';
import HallOfFame from '../components/dashboard/HallOfFame';
import PlayersManagement from '../components/dashboard/PlayersManagement';
import ServerStatus from '../components/dashboard/ServerStatus';
import Settings from '../components/dashboard/Settings';
import TodoList from '../components/dashboard/TodoList';
import UserManagement from '../components/dashboard/UserManagement';
import VehicleManagement from '../components/dashboard/VehicleManagement';
import DashboardLayout from '../components/layout/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<FivemOverview />} />
        <Route path="players" element={<PlayersManagement />} />
        <Route path="vehicles" element={<VehicleManagement />} />
        <Route path="hall-of-fame" element={<HallOfFame />} />
        <Route path="chat" element={<Chat />} />
        <Route path="todo" element={<TodoList />} />
        <Route path="server" element={<ServerStatus />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
