import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { adminService } from '../services/adminService';
import { User, Role, AdminCreateUserRequest, AdminUpdateUserRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Users,
  Shield,
  Briefcase,
  UserCheck,
  Lock,
  Mail,
  Building,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modals & form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form states
  const [addForm, setAddForm] = useState<AdminCreateUserRequest>({
    fullName: '',
    email: '',
    password: '',
    role: 'RECRUITER',
    company: '',
  });

  const [editForm, setEditForm] = useState<AdminUpdateUserRequest>({
    fullName: '',
    email: '',
    role: 'RECRUITER',
    company: '',
    password: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load user directory.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  // Quick role change handler
  const handleQuickRoleChange = async (userId: number, newRole: Role) => {
    try {
      const updated = await adminService.updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      setFeedback({
        type: 'success',
        message: `Updated permissions for ${updated.fullName} to ${newRole}.`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update user role.',
      });
    }
  };

  // Add user submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const created = await adminService.createUser(addForm);
      setUsers((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      setAddForm({
        fullName: '',
        email: '',
        password: '',
        role: 'RECRUITER',
        company: '',
      });
      setFeedback({
        type: 'success',
        message: `Account created for ${created.fullName} (${created.role}).`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create user account.',
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (target: User) => {
    setSelectedUser(target);
    setEditForm({
      fullName: target.fullName,
      email: target.email,
      role: target.role,
      company: target.company || '',
      password: '',
    });
    setIsEditModalOpen(true);
  };

  // Edit user submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    if (!selectedUser) return;
    e.preventDefault();
    setFormLoading(true);
    try {
      const updated = await adminService.updateUser(selectedUser.id, editForm);
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updated : u)));
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setFeedback({
        type: 'success',
        message: `Successfully updated user profile for ${updated.fullName}.`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update user account.',
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Delete user confirm
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await adminService.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setFeedback({
        type: 'success',
        message: `Account for ${userToDelete.fullName} (${userToDelete.email}) was removed.`,
      });
      setUserToDelete(null);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete user account.',
      });
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.company && u.company.toLowerCase().includes(search.toLowerCase()));

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // Counts
  const counts = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === 'ADMIN').length,
      recruiters: users.filter((u) => u.role === 'RECRUITER').length,
      hiringManagers: users.filter((u) => u.role === 'HIRING_MANAGER' || u.role === 'INTERVIEWER').length,
    };
  }, [users]);

  // Role Badge Styling
  const getRoleBadgeStyle = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RECRUITER':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'HIRING_MANAGER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'INTERVIEWER':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (currentUser && currentUser.role !== 'ADMIN') {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Administrator Privileges Required</h2>
        <p className="text-sm text-slate-500 mt-2">
          This governance portal is reserved for system administrators. Please sign in as an administrator to manage user roles and permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              User Access & Role Governance
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Administer team members, grant Recruiter and Administrator privileges, or remove access.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Platform User
        </button>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Members
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{counts.total}</p>
          <p className="text-xs text-slate-500 mt-1">Registered accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Administrators
            </span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Shield className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{counts.admins}</p>
          <p className="text-xs text-slate-500 mt-1">Full governance control</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Recruiters
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{counts.recruiters}</p>
          <p className="text-xs text-slate-500 mt-1">Talent pipeline owners</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Managers & Reviewers
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{counts.hiringManagers}</p>
          <p className="text-xs text-slate-500 mt-1">Interview & review roles</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'INTERVIEWER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                roleFilter === r
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'ALL'
                ? 'All Roles'
                : r === 'ADMIN'
                ? 'Admins'
                : r === 'RECRUITER'
                ? 'Recruiters'
                : r === 'HIRING_MANAGER'
                ? 'Managers'
                : 'Interviewers'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSkeleton type="table" rows={6} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Users Found"
          description="Try adjusting your search criteria or add a new team member."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User Member</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Quick Role Switch</th>
                  <th className="px-6 py-4">Member Since</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-slate-900">{u.fullName}</span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-100 text-brand-700 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {u.company || 'HireFlow Enterprise'}
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(
                            u.role
                          )}`}
                        >
                          {u.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                          {u.role}
                        </span>
                      </td>

                      {/* Inline Quick Role Selector */}
                      <td className="px-6 py-4">
                        <select
                          disabled={isCurrent}
                          value={u.role}
                          onChange={(e) => handleQuickRoleChange(u.id, e.target.value as Role)}
                          className="text-xs rounded-lg border border-slate-200 bg-white py-1.5 px-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:bg-slate-50 cursor-pointer"
                        >
                          <option value="RECRUITER">Recruiter</option>
                          <option value="ADMIN">Administrator</option>
                          <option value="HIRING_MANAGER">Hiring Manager</option>
                          <option value="INTERVIEWER">Interviewer</option>
                        </select>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                            title="Edit user details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            disabled={isCurrent}
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                            title={isCurrent ? 'Cannot delete your own active account' : 'Delete user account'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Platform Member"
        description="Create credentials and assign an organizational access role."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={addForm.fullName}
              onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
              placeholder="e.g. Jordan Smith"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                placeholder="user@example.com"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={4}
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                placeholder="At least 4 characters"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Role & Permissions
            </label>
            <select
              value={addForm.role}
              onChange={(e) => setAddForm({ ...addForm, role: e.target.value as Role })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="RECRUITER">Recruiter (Manage jobs, applicants, resumes)</option>
              <option value="ADMIN">Administrator (Full governance, users, audit, settings)</option>
              <option value="HIRING_MANAGER">Hiring Manager (Review candidates, schedule interviews)</option>
              <option value="INTERVIEWER">Interviewer (Scorecards & stage feedback)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Company / Department (Optional)
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={addForm.company}
                onChange={(e) => setAddForm({ ...addForm, company: e.target.value })}
                placeholder="HireFlow Enterprise"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors disabled:opacity-50"
            >
              {formLoading ? 'Creating User...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title={`Edit User: ${selectedUser?.fullName}`}
        description="Update contact profile, change role permissions, or reset password."
        maxWidth="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={editForm.fullName}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Role & Permissions
            </label>
            <select
              value={editForm.role}
              disabled={currentUser?.id === selectedUser?.id}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value as Role })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white disabled:bg-slate-100 disabled:opacity-60"
            >
              <option value="RECRUITER">Recruiter</option>
              <option value="ADMIN">Administrator</option>
              <option value="HIRING_MANAGER">Hiring Manager</option>
              <option value="INTERVIEWER">Interviewer</option>
            </select>
            {currentUser?.id === selectedUser?.id && (
              <p className="text-[11px] text-slate-400 mt-1">
                You cannot modify your own administrator role.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Company
            </label>
            <input
              type="text"
              value={editForm.company}
              onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Reset Password (Optional)
            </label>
            <input
              type="password"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              placeholder="Leave blank to keep existing password"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors disabled:opacity-50"
            >
              {formLoading ? 'Saving Changes...' : 'Save Updates'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete the account for ${userToDelete?.fullName} (${userToDelete?.email})? All associated session tokens will be revoked.`}
        confirmText="Delete Account"
        isDestructive
      />
    </div>
  );
};
