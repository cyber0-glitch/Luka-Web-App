import React, { useState } from 'react';
import { HabitGroup } from '../../types';
import Button from '../common/Button';
import ColorPicker from '../common/ColorPicker';
import Modal from '../common/Modal';

interface GroupsManagementProps {
  groups: HabitGroup[];
  onCreateGroup: (group: HabitGroup) => void;
  onUpdateGroup: (group: HabitGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  habitCountByGroup: (groupId: string) => number;
}

const GroupsManagement: React.FC<GroupsManagementProps> = ({
  groups,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  habitCountByGroup,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<HabitGroup | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    color: '#007AFF',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#007AFF',
    });
    setEditingGroup(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEdit = (group: HabitGroup) => {
    setFormData({
      name: group.name,
      color: group.color || '#007AFF',
    });
    setEditingGroup(group);
    setShowCreateModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingGroup) {
      onUpdateGroup({
        ...editingGroup,
        name: formData.name,
        color: formData.color,
      });
    } else {
      onCreateGroup({
        id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        color: formData.color,
        sortOrder: groups.length,
        collapsed: false,
      });
    }

    setShowCreateModal(false);
    resetForm();
  };

  const handleDelete = (groupId: string) => {
    const habitCount = habitCountByGroup(groupId);
    if (habitCount > 0) {
      if (!confirm(`This group has ${habitCount} habit(s). These habits will be moved to "Ungrouped". Continue?`)) {
        return;
      }
    }
    onDeleteGroup(groupId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Habit Groups
        </h3>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          + New Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
            No groups yet. Create your first group to organize your habits.
          </p>
          <Button variant="secondary" onClick={handleOpenCreate}>
            Create Group
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {groups
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((group) => {
              const habitCount = habitCountByGroup(group.id);

              return (
                <div
                  key={group.id}
                  className="p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {group.color && (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                    )}
                    <div>
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {group.name}
                      </p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {habitCount} habit{habitCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(group)}
                      className="p-2 rounded-lg hover:bg-bg-tertiary-light dark:hover:bg-bg-tertiary-dark transition-colors"
                      aria-label="Edit group"
                    >
                      <svg
                        className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    {deleteConfirmId === group.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-1 text-sm rounded-lg bg-bg-tertiary-light dark:bg-bg-tertiary-dark hover:bg-bg-primary-light dark:hover:bg-bg-primary-dark transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="px-3 py-1 text-sm rounded-lg bg-error text-white hover:bg-opacity-90 transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(group.id)}
                        className="p-2 rounded-lg hover:bg-error/10 transition-colors"
                        aria-label="Delete group"
                      >
                        <svg
                          className="w-5 h-5 text-error"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title={editingGroup ? 'Edit Group' : 'Create Group'}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
              Group Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning Routine, Fitness"
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
              Color (Optional)
            </label>
            <ColorPicker
              selectedColor={formData.color}
              onSelect={(color) => setFormData({ ...formData, color })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!formData.name.trim()}
              fullWidth
            >
              {editingGroup ? 'Save Changes' : 'Create Group'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupsManagement;
