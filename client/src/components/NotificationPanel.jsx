import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation } from "../redux/slices/apiSlice";
import { io } from "socket.io-client";
import ViewNotification from "./ViewNotification";
import { toast } from "sonner";

const ICONS = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { data: notifications, refetch, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const readHandler = async (id) => {
    try {
      await markAsRead(id).unwrap();
      refetch();
      toast.success('Notification marked as read');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Error marking notification as read");
    }
  };

  const viewHandler = async (notification) => {
    setSelected(notification);
    try {
      await readHandler(notification._id);
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const readAllHandler = async () => {
    try {
      await markAllAsRead().unwrap();
      refetch();
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Error marking all notifications as read");
    }
  };

  const callsToAction = [
    { name: "Cancel", href: "#" },
    {
      name: "Mark All Read",
      onClick: readAllHandler
    },
  ];

  return (
    <>
      <Popover className='relative'>
        <Popover.Button className='inline-flex items-center outline-none'>
          <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
            <IoIosNotificationsOutline className='text-2xl' />
            {notifications?.length > 0 && (
              <span className='absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                {notifications?.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-200'
          enterFrom='opacity-0 translate-y-1'
          enterTo='opacity-100 translate-y-0'
          leave='transition ease-in duration-150'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 translate-y-1'
        >
          <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
            {({ close }) => (
              <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                <div className='p-4'>
                  {isLoading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : notifications?.length > 0 ? (
                    notifications?.slice(0, 5).map((item) => (
                      <div
                        key={item._id}
                        className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50'
                      >
                        <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white'>
                          {ICONS[item.notiType]}
                        </div>

                        <div
                          className='cursor-pointer'
                          onClick={() => viewHandler(item)}
                        >
                          <div className='flex items-center gap-3 font-semibold text-gray-900 capitalize'>
                            <p>{item.notiType}</p>
                            <span className='text-xs font-normal lowercase'>
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>

                          <p className='line-clamp-1 mt-1 text-gray-600'>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>

                {notifications?.length > 0 && (
                  <div className='grid grid-cols-2 divide-x bg-gray-50'>
                    {callsToAction.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.onClick ? item.onClick() : close();
                        }}
                        className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100'
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>

      <ViewNotification
        open={open}
        setOpen={setOpen}
        el={selected}
      />
    </>
  );
};

export default NotificationPanel;