import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { FindCase } from './components/sc-modal'
import { useNavigate } from 'react-router'
export const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-[url(/bg-1.jpg)] h-[fit] flex flex-col bg-center bg-no-repeat bg-cover">
            <header className='flex justify-end absolute p-2 w-full'>
                <nav>
                    <Button className={'text-xl p-2 text-white underline'} variant={'ghost'} onClick={() => navigate('/lorem')}>Patner Login</Button>
                </nav>
            </header>
            <main className='flex w-[50%] '>
                <div className="flex flex-col gap-2 items-center justify-center h-screen">
                    <div className=" text-start p-5">
                        <h1 className='text-5xl font-bold text-emerald-300 '>Integrated Service System Delivery</h1>
                        <p className='text-xl text-emerald-100'>Welcome to our Integrated Service System Delivery! </p>
                        <p className='text-xl text-emerald-100'>Our system is designed to provide you with the best service experience possible. </p>
                    </div>
                    <div className='flex items-center w- justify-center gap-4 p-5'>
                        <Card className={'flex h-full w-full bg-transparent'}>
                            <CardHeader className={'flex flex-col items-center'}>
                                <img className='w-20 h-20' src="/FindCase.png" alt="" />
                                <CardTitle className={'text-2xl text-center font-medium text-emerald-100'}>Find Your Case</CardTitle>
                            </CardHeader>
                            <CardContent className={'flex flex-col items-center justify-center gap-2'}>
                                <CardDescription>Find your case and see the information</CardDescription>
                                <FindCase></FindCase>
                            </CardContent>
                        </Card>
                        <Card className={'flex h-full w-full bg-transparent'}>
                            <CardHeader className={'flex flex-col items-center'}>
                                <img className='w-20 h-20' src="/NearLoc.png" alt="" />
                                <CardTitle className={'text-2xl text-center font-medium text-emerald-100'}>Find Nearest Service Center</CardTitle>
                            </CardHeader>
                            <CardContent className={'flex flex-col items-center'}>
                            </CardContent>
                        </Card>
                        <Card className={'flex h-full w-full bg-transparent'}>
                            <CardHeader className={'flex flex-col items-center'}>
                                <img className='w-20 h-20' src="FeedBack.png" alt="" />
                                <CardTitle className={'text-2xl text-center font-medium text-emerald-100'}>Give Feedback</CardTitle>
                            </CardHeader>
                            <CardContent className={'flex flex-col items-center'}>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="p-5 text-white">
                        <p> We are committed to providing the best service experience for our customers. Our system is designed to streamline the service process, making it easier for you to find the information you need and get the help you deserve.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
