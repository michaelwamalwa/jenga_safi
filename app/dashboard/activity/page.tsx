'use client';

export default function ActivityLogPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-rose-700 mb-4">
        📝 Activity Log
      </h1>
      <p className="text-gray-700 mb-4">
        Admins can view task completions, user changes, and more.
      </p>
      <ul className="space-y-2">
        <li className="bg-gray-100 p-3 rounded">User JohnDoe completed "Recycle Plastic" on June 21</li>
        <li className="bg-gray-100 p-3 rounded">Admin updated team permissions on June 19</li>
        {/* Add real logs from the database later */}
      </ul>
    </div>
  );
}
