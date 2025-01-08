export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'overdue':
      return 'bg-red-500';
    case 'draft':
      return 'bg-gray-500';
    default:
      return 'bg-blue-500';
  }
};