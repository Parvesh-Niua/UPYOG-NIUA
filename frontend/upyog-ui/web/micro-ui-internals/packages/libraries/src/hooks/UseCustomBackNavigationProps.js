import { useEffect } from 'react';
import useCustomNavigate from './useCustomNavigate';

/**
 * Custom hook to handle back button navigation
 * @author Shivank - NIUA
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.redirectPath - Path to redirect to when back button is clicked
 * @param {boolean} [config.enableConfirmation=false] - Whether to show confirmation dialog
 * @param {string} [config.confirmationMessage='Are you sure you want to leave this page?'] - Custom confirmation message
 */
export const useCustomBackNavigation = ({
  redirectPath,
  enableConfirmation = false,
  confirmationMessage = 'Are you sure you want to leave this page?'
}) => {
  const navigate = useCustomNavigate();

  useEffect(() => {
    // Add a new entry to browser's history stack
    window.history.pushState(null, '', window.location.pathname);

    const handleBackButton = () => {
      if (enableConfirmation) {
        // Show confirmation dialog if enabled
        const shouldRedirect = window.confirm(confirmationMessage);
        if (shouldRedirect) {
          navigate(redirectPath);
        } else {
          // Prevent back navigation by re-pushing state
          window.history.pushState(null, '', window.location.pathname);
        }
      } else {
        // Directly redirect without confirmation
        navigate(redirectPath);
      }
    };

    // Add popstate event listener
    window.addEventListener('popstate', handleBackButton);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate, redirectPath, enableConfirmation, confirmationMessage]);
};