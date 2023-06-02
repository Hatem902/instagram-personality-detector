import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import { Badge, badgeVariants } from '../components/ui/badge';
import { getUser } from '../helpers/backend/get-users';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  function fetchM(url, method) {
    return {
      json: async () => ({ message: 'response' }),
    };
  }
  const [predictedUser, setPredictedUser] = useState(-1);
  const [loading, setLoading] = useState(false);
  let userPredicted;

  const users = getUser;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPredictedUser(predictedUser + 1);
      try {
        const response = fetchM('/api/endpoint/userByUrl', 'POST');
        const data = response.json();
        userPredicted = data;
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }, 3000);
  };
  return (
    <main className='container flex flex-col mt-28 gap-2 items-center '>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className='flex w-full gap-6 items-center mb-28 '
      >
        <Input placeholder='Type in the instagram user URL to predict his personnality...' />
        <Select>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Model' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='light'>BERT</SelectItem>
            <SelectItem value='dark'>CNN</SelectItem>
            <SelectItem value='system'>VILT</SelectItem>
          </SelectContent>
        </Select>

        <Button type='submit' className='max-w-full w-28'>
          Predict
        </Button>
      </form>

      {loading ? (
        <>
          <ReactLoading
            type='spinningBubbles'
            color='#000000'
            height={'5%'}
            width={'5%'}
          />
          <div className='mt-1.5 font-semibold text-slate-600 animate-pulse animate-bounce'>
            Loading...
          </div>
        </>
      ) : (
        predictedUser != -1 && (
          <>
            <div className='text-slate-900 mb-10'>
              <span className='font-semibold'>
                {users[predictedUser].user_id}
              </span>
              's personality :
              <Badge className='font-semibold ml-2 tracking-wider '>
                {users[predictedUser].personality}
              </Badge>
            </div>
            <div className='flex gap-4'>
              <Card>
                <CardHeader>
                  <CardDescription>Number of posts</CardDescription>
                  <CardTitle>{users[predictedUser].posts}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Average number of likes</CardDescription>
                  <CardTitle>{users[predictedUser].likes}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </>
        )
      )}
    </main>
  );
}
