'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface CoreTeamMember {
  _id: string;
  name: string;
  image: string;
  role: string;
  linkedin: string;
  order?: number;
}

// Sort by assigned order (ascending). Members without an order fall to the end.
function sortByOrder(list: CoreTeamMember[]): CoreTeamMember[] {
  return [...list].sort(
    (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
  );
}

export default function CoreTeamPage() {
  const [members, setMembers] = useState<CoreTeamMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reordering, setReordering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    role: '',
    linkedin: '',
    order: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/core-team');
      if (!response.ok) throw new Error('Failed to fetch core team members');
      const data = await response.json();
      setMembers(sortByOrder(data));
    } catch (error) {
      setError('Failed to load core team members');
      console.error('Error fetching core team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', image: '', role: '', linkedin: '', order: '' });
    setImageFile(null);
    setImagePreview('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const formDataImg = new FormData();
        formDataImg.append('file', imageFile);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataImg,
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const { url } = await uploadResponse.json();
        imageUrl = url;
      }
      const url = editingId
        ? `/api/admin/core-team?id=${editingId}`
        : '/api/admin/core-team';
      const payload = {
        ...formData,
        image: imageUrl,
        order: formData.order === '' ? 0 : Number(formData.order),
      };
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(editingId ? 'Failed to update member' : 'Failed to add member');
      const updatedMember = await response.json();
      if (editingId) {
        setMembers(sortByOrder(members.map(m => m._id === editingId ? updatedMember : m)));
      } else {
        setMembers(sortByOrder([updatedMember, ...members]));
      }
      resetForm();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: CoreTeamMember) => {
    setFormData({
      name: member.name,
      image: member.image,
      role: member.role,
      linkedin: member.linkedin,
      order: member.order ? String(member.order) : ''
    });
    setImagePreview(member.image);
    setEditingId(member._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      const response = await fetch(`/api/admin/core-team?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete member');
      setMembers(members.filter(m => m._id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Inline order edit straight from a card — commits on Enter/blur.
  const updateOrder = async (id: string, raw: string) => {
    const value = raw === '' ? 0 : Number(raw);
    if (Number.isNaN(value)) return;
    const current = members.find(m => m._id === id);
    if (current && (current.order ?? 0) === value) {
      setMembers(sortByOrder(members)); // no change, just re-sort
      return;
    }
    setError('');
    try {
      const response = await fetch(`/api/admin/core-team?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: value }),
      });
      if (!response.ok) throw new Error('Failed to update order');
      const updated = await response.json();
      setMembers(prev => sortByOrder(prev.map(m => m._id === updated._id ? updated : m)));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const moveMember = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= members.length) return;

    // Optimistically swap the two members in the displayed list.
    const reordered = [...members];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const previous = members;
    setMembers(reordered);
    setReordering(true);
    setError('');

    try {
      const response = await fetch('/api/admin/core-team/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: reordered.map(m => m._id) }),
      });
      if (!response.ok) throw new Error('Failed to save new order');
      const updated = await response.json();
      setMembers(sortByOrder(updated));
    } catch (error: any) {
      setMembers(previous); // roll back on failure
      setError(error.message);
    } finally {
      setReordering(false);
    }
  };

  if (loading && !isAdding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading core team...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Core Team</h1>
        <Button onClick={() => setIsAdding(true)} className="flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Add Member
        </Button>
      </div>
      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>
      )}
      {isAdding && (
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{editingId ? 'Edit Member' : 'Add New Member'}</h2>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Avatar</Label>
              <div className="flex items-center space-x-4">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <Button type="button" variant="outline" onClick={() => document.getElementById('image')?.click()}>
                  Choose Image
                </Button>
                {imagePreview && (
                  <div className="relative w-20 h-20">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-full" />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input id="linkedin" type="url" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" min="0" placeholder="e.g. 1 (lower shows first)" value={formData.order} onChange={e => setFormData({ ...formData, order: e.target.value })} />
                <p className="text-xs text-muted-foreground">Lower numbers appear first. Leave blank or 0 to keep it unset.</p>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}</Button>
            </div>
          </form>
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Use the ↑ / ↓ arrows to reorder members, or set a number in each member&apos;s
        Display Order field. This order is what appears on the public About page.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <Card key={member._id} className="overflow-hidden relative">
            <CardContent className="p-0">
              <div className="absolute top-3 left-3 flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-muted text-xs font-semibold">
                #{index + 1}
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0 || reordering}
                  onClick={() => moveMember(index, 'up')}
                  aria-label="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === members.length - 1 || reordering}
                  onClick={() => moveMember(index, 'down')}
                  aria-label="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="relative w-24 h-24 mb-4">
                  <Image src={member.image || '/placeholder-avatar.jpg'} alt={member.name} fill className="object-cover rounded-full" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{member.role}</p>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mb-2">LinkedIn</a>
                <div className="flex items-center gap-2 mt-1 mb-1">
                  <Label htmlFor={`order-${member._id}`} className="text-xs text-muted-foreground">Order</Label>
                  <Input
                    id={`order-${member._id}`}
                    type="number"
                    min="0"
                    value={member.order ?? 0}
                    onChange={e => {
                      const v = e.target.value === '' ? 0 : Number(e.target.value);
                      setMembers(prev => prev.map(m => m._id === member._id ? { ...m, order: v } : m));
                    }}
                    onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                    onBlur={e => updateOrder(member._id, e.target.value)}
                    className="w-16 h-8 text-center"
                  />
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(member)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(member._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 