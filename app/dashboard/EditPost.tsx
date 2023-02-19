'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import Toggle from './Toggle';
import toast from 'react-hot-toast';

type EditProps = {
  id: string;
  avatar: string;
  name: string;
  title: string;
  comments?: {
    id: string;
    postId: string;
    userId: string;
  }[];
};

export default function EditPost({
  avatar,
  name,
  title,
  comments,
  id,
}: EditProps) {
  const [toggle, setToggle] = useState(false);
  let deleteToastID: string;
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async (id: string) =>
      await axios.delete('/api/posts/deletePost', { data: id }),
    {
      onError: (error) => {
        console.log(error);
        toast.error('Error deleting that post', { id: deleteToastID });
      },
      onSuccess: (data) => {
        console.log(data);
        toast.success('Post has been deleted', { id: deleteToastID });
        queryClient.invalidateQueries({ queryKey: ['auth-posts'] });
      },
    }
  );

  const deletePost = () => {
    deleteToastID = toast.loading('Deleting your post...', {
      id: deleteToastID,
    });
    mutate(id);
  };

  return (
    <>
      <div className="bg-white my-8 p-8 rounded-lg">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src={avatar}
            alt={'avatar'}
            width={32}
            height={32}
          />
          <h3 className="font-bold text-gray-700">{name}</h3>
        </div>
        <div className="my-8">
          <p className="break-all">{title}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-small font-bold text-gray-700">
            ({comments?.length}) Comments
          </p>
          <button
            className="text-sm font-bold text-red-500"
            onClick={(e) => {
              setToggle(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {toggle && <Toggle deletePost={deletePost} setToggle={setToggle} />}
    </>
  );
}
