// src/components/admin/ViewMembers.jsx
import React, { useState, useEffect } from 'react';
import { getMembers } from '../../services/api';

function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getMembers();
        setMembers(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading data anggota...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto bg-neum-bg rounded-lg shadow-neum-in p-4">
      <table className="min-w-full divide-y divide-gray-300/50">
        <thead className="bg-neum-bg">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700">Nama Asli</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">NIM</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">Login Pertama</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300/50 bg-neum-bg">
          {members.map((member) => (
            <tr key={member._id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-800">{member.namaAsli}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">{member.nim}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                {member.isFirstLogin ? 'Ya' : 'Tidak'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewMembers;