import { FaCheck, FaCheckCircle } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';

export const ErrorView = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-red-100 border border-red-300 rounded-md shadow-sm">
      <FaCircleExclamation className="text-2xl text-red-600" />
      <p className="text-red-800 font-medium">{message}</p>
    </div>
  );
};

export const SuccessView = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-green-100 border border-green-300 rounded-md shadow-sm">
      <FaCheckCircle className="text-2xl text-green-600" />
      <p className="text-green-800 font-medium">{message}</p>
    </div>
  );
};
