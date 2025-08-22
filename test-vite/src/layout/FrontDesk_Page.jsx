import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter, CardContent, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import React from 'react'

const FrontDesk_Page = () => {
  const { user } = useAuth();
  const cards = [
    { id: 1, title: 'Card 1', description: 'Small description for this card.', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.' },
    { id: 2, title: 'Card 2', description: 'Small description for this card.', content: 'Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.' },
    { id: 3, title: 'Card 3', description: 'Small description for this card.', content: 'Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.' },
    { id: 4, title: 'Card 4', description: 'Small description for this card.', content: 'Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.' },
    // { id: 5, title: 'Card 5', description: 'Small description for this card.', content: 'Inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.' },
    // { id: 6, title: 'Card 6', description: 'Small description for this card.', content: 'Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor.' },
    // { id: 7, title: 'Card 7', description: 'Small description for this card.', content: 'Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.' },
    // { id: 8, title: 'Card 8', description: 'Small description for this card.', content: 'Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis.' },
  ]

  const notif = [
    { id: 1, title: 'Notification 1', description: 'This is the first notification.', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, title: 'Notification 2', description: 'This is the second notification.', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 3, title: 'Notification 3', description: 'This is the third notification.', content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    { id: 4, title: 'Notification 4', description: 'This is the fourth notification.', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
  ]

  return (
    <div>
      <h1 className='text-2xl my-5 shadow-2xl scroll-m-20 tracking-tight font-medium text-balance text-center'>Welcome Back "{user.name}"   &#128522;</h1>
      <section className="mx-auto w-full max-w-7xl p-4 md:p-6 bg-gray-300">
        <h1 className='text-xl mb-5 shadow-2xl scroll-m-20 tracking-tight font-medium text-balance'>Recent Case List</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.id} className="shadow-sm">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.content}</p>
              </CardContent>
              <CardFooter className="justify-end">
                <Button size="sm" variant="outline">Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl p-4 md:p-6 bg-gray-300">
        <h1 className='text-xl mb-5 shadow-2xl scroll-m-20 tracking-tight font-medium text-balance'>Recent Notification</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {notif.map((c) => (
            <Card key={c.id} className="shadow-sm border-2 border-gray-400">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                <CardDescription>{c.description}</CardDescription>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.content}</p>
              </CardHeader>
              
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default FrontDesk_Page;