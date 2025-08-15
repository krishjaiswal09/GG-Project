// import React from 'react';
// import { useAdmin } from '../contexts/AdminContext';

// function UserManagement() {
//   const { isAdmin, users, userPermissions, setUserPermission } = useAdmin();

//   // If not admin, don't render this component
//   if (!isAdmin) {
//     return null;
//   }

//   return (
//     <div className="bg-white rounded-xl shadow p-6 mb-6">
//       <h2 className="text-xl font-semibold mb-4">User Management</h2>
//       <p className="text-sm text-gray-500 mb-4">
//         As an admin, you can control which users can edit tasks.
//       </p>
      
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 User
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Permissions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {users.map((user) => (
//               <tr key={user._id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-500">{user.email}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <span className="mr-2 text-sm">Can Edit:</span>
//                     <label className="inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="sr-only peer"
//                         checked={userPermissions[user._id]?.canEdit ?? true}
//                         onChange={(e) => setUserPermission(user._id, e.target.checked)}
//                       />
//                       <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default UserManagement;