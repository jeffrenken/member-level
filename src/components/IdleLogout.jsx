import { Button, Dialog, DialogActions, DialogContent, Typography } from '@/components/ui';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

const ALLOWED_IDLE_TIME = 1000 * 60 * 10; // 10 minutes
const DIALOG_TIME = 1000 * 30; // 30 seconds

export const IdleLogout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(DIALOG_TIME / 1000);
  const logout = () => toast.success('You have been logged out');

  useEffect(() => {
    setCount(DIALOG_TIME / 1000);
  }, [open]);

  useEffect(() => {
    if (count > 0) {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup on component unmount or when count changes
    }
  }, [count]);

  const handleClose = (e, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };
  let timer;

  // this function sets the timer that logs out the user after 10 secs
  const handleModalTimer = () => {
    setOpen(true);
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      handleLogout();
    }, DIALOG_TIME);
  };

  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      handleModalTimer();
    }, ALLOWED_IDLE_TIME);
  };

  // this resets the timer if it exists.
  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  // when component mounts, it adds an event listeners to the window
  // each time any of the event is triggered, i.e on mouse move, click, scroll, keypress etc, the timer to logout user after 10 secs of inactivity resets.
  // However, if none of the event is triggered within 10 secs, that is app is inactive, the app automatically logs out.
  useEffect(() => {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
  }, []);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Typography>
            Still here? You will be logged out in {count} second{count > 1 && 's'} due to inactivity.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="neutral">
            Logout
          </Button>
          <Button onClick={handleClose}>Still here</Button>
        </DialogActions>
      </Dialog>
      {children}
    </>
  );
};
