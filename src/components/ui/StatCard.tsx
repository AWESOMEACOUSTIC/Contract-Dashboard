interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  color?: 'blue' | 'red' | 'orange' | 'purple' | 'green';
}

export default function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  color = 'blue' 
}: StatCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500/20 text-red-400';
      case 'orange':
        return 'bg-orange-500/20 text-orange-400';
      case 'purple':
        return 'bg-purple-500/20 text-purple-400';
      case 'green':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="bg-[#181820] border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}