import ApiCustomer from '@/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import { set } from 'lodash';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const FrontDesk_Page = () => {

  const [caseData, setCaseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();


  const notif = [
    { id: 1, title: 'Notification 1', description: 'This is the first notification.', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, title: 'Notification 2', description: 'This is the second notification.', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 3, title: 'Notification 3', description: 'This is the third notification.', content: 'Ut enim ad minim veniam, quis nostrud exercitation .' },
    { id: 4, title: 'Notification 4', description: 'This is the fourth notification.', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
  ]

  const fetchData = async () => {
    setLoading(true);
    try {
      

   const response = await ApiCustomer.get('/api/case-information');

      const filtercases = response.data.data.filter(c => c.CaseStatus !== 'Close');

      const sortedCases = filtercases.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));

      const recentCases = sortedCases.slice(0, 4);


    setCaseData(recentCases);
      return response.data.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data. Silakan coba lagi.',
      });
      console.error('Error fetching case data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  console.log("Case Data:", caseData);
  

  return (
    <div>
      <h1 className='text-2xl my-5  scroll-m-20 tracking-tight font-medium text-balance text-center'>Welcome Back "{user.name}"   &#128522;</h1>
      <section className="mx-auto w-full max-w-7xl p-4 md:p-6 bg-gray-200">
        <h1 className='text-xl mb-5 shadow-2xl scroll-m-20 tracking-tight font-medium text-balance'>Recent Case List</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          

          {loading ? (
            <>
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </>
          ) : (
            caseData.map((c) => (
              <Card className="w-72 shadow-sm hover:shadow-lg transition border-2 border-teal-200 cursor-pointer" key={c.CaseID}>
                <CardHeader className="flex justify-between items-center bg-[#333333] text-white p-4">
                  <CardTitle className="text-sm font-semibold">
                    #{c.CaseID}
                  </CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
          ${c.CasePriority === "High" ? "bg-orange-100 text-orange-700" :
                      c.CasePriority === "Critical" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"}`}>
                    {c.CasePriority}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium truncate">{c.CaseSubject}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {c.CaseStatus}
                    </span>
                    <span>{c.CreatedOn}</span>
                  </div>
                </CardContent>
              </Card>
          )))}
          <Button variant="outline" className="col-span-4 md:col-span-3 lg:col-span-4 mt-4" onClick={() => window.location.href = '/app/case'}>See More Case </Button>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl p-4 md:p-6 bg-gray-300">
        <h1 className='text-xl mb-5 shadow-2xl scroll-m-20 tracking-tight font-medium text-balance'>Recent Notification</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {notif.map((c) => (
            <Card key={c.id} className="shadow-sm border-2 border-gray-400">
              <CardHeader>
                <CardTitle className={'flex justify-between'}><p>{c.title}</p> 02/12/2020</CardTitle>
                <CardDescription>{c.description}</CardDescription>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.content}</p>
              </CardHeader>
              
            </Card>
          ))}
          <Button variant="outline" className="col-span-1 md:col-span-3 lg:col-span-4 mt-4" onClick={() => window.location.href = '/app/case'}>See More Notification </Button>

        </div>
      </section>
    </div>
  )
}

export default FrontDesk_Page;