import toast from 'react-hot-toast';

const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: 'white',
        fontWeight: '500',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: 'white',
        fontWeight: '500',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: 'white',
        fontWeight: '500',
      },
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  promise: (promise, messages) => {
    return toast.promise(promise, messages, {
      position: 'top-right',
      success: {
        style: {
          background: '#10b981',
          color: 'white',
          fontWeight: '500',
        },
      },
      error: {
        style: {
          background: '#ef4444',
          color: 'white',
          fontWeight: '500',
        },
      },
      loading: {
        style: {
          background: '#3b82f6',
          color: 'white',
          fontWeight: '500',
        },
      },
    });
  }
};

export default showToast;