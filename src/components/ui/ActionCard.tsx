import { Link } from 'react-router-dom';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionType: 'button' | 'link';
  action: (() => void) | string;
  actionText: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export default function ActionCard({ 
  title, 
  description, 
  icon, 
  actionType, 
  action, 
  actionText, 
  color = 'blue' 
}: ActionCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          container: 'bg-green-900/20 border-green-700/50',
          icon: 'bg-green-500/20',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'orange':
        return {
          container: 'bg-orange-900/20 border-orange-700/50',
          icon: 'bg-orange-500/20',
          button: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'red':
        return {
          container: 'bg-red-900/20 border-red-700/50',
          icon: 'bg-red-500/20',
          button: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          container: 'bg-blue-900/20 border-blue-700/50',
          icon: 'bg-blue-500/20',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const styles = getColorClasses(color);

  const renderAction = () => {
    const buttonClasses = `px-4 py-2 ${styles.button} text-white rounded-lg transition-colors`;
    
    if (actionType === 'link' && typeof action === 'string') {
      return (
        <Link to={action} className={buttonClasses}>
          {actionText}
        </Link>
      );
    } else if (actionType === 'button' && typeof action === 'function') {
      return (
        <button onClick={action} className={buttonClasses}>
          {actionText}
        </button>
      );
    }
    
    return null;
  };

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${styles.container}`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${styles.icon}`}>
          {icon}
        </div>
        <div>
          <p className="text-white font-medium">{title}</p>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      {renderAction()}
    </div>
  );
}