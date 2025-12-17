import { driver } from 'driver.js';
import { Button } from './ui/button';
import { OctagonAlert } from 'lucide-react';
import { useLocation } from 'react-router';
import { useAuth } from '../context/auth-context';
import "driver.js/dist/driver.css";


export const ButtonTour = () => {
    const location = useLocation()
    const {user, loading } = useAuth()
      if (loading || !user) {
    return null; 
  }

    const TextList = ({ list }) => {
    return list.map((item, index) => `<div>${index + 1}. ${item}</div>`).join("");
    };

    const StepByPage = {
        "/app":[
            {element: '#welcome', roles:['fd'] ,popover: {title: 'Welcome to Aplikasi Service Management',description: "Aplikasi ini digunakan untuk mempermudah proses manajemen layanan pelanggan dan penanganan kasus servis."}},
            {element: '#dashboard', popover: {title: 'Dashboard Overview',description: "Di sini Anda dapat melihat ringkasan statistik layanan, kasus terbaru, dan tugas yang perlu ditindaklanjuti."}},
            {element: '#navigation', popover: {title: 'Navigasi Utama',description: "Gunakan menu navigasi untuk mengakses berbagai fitur aplikasi seperti manajemen kasus, pelanggan, dan laporan."}},
        ],
        "/app/searchcaseproto2": [
            {element: '#quickSearch', popover: {title: 'Menu Search Serial Number & Customer',description: TextList({
                list: ["Masukkan data Serial Number atau Customer", "Jika data tersebut tidak ada maka checklist Asset Baru dan Customer Baru"]
            })}},
            {element: '#case', popover: {title: 'Menu Case',description: TextList({
                list: ["Bintang merah, menandakan field wajib di isi", "Pengurutan Input: Case Subject / Problem Desc / Case Note"]
            }),}},
            {element: '#customer', popover: {title: 'Menu Customer, Pic & Company',description: TextList({
                list: ["Bintang merah, menandakan field wajib di isi", "Fungsi Checkbox, Apabila termasuk  PIC & Company",]
            })}},
            {element: '#product', popover: {title: 'Menu Product',description: TextList({
                list: ["Bintang merah, menandakan field wajib di isi", "Search Product, untuk check ketersediaan product", "Jika Product tidak tersedia, maka add dengan checklist product baru", "Button Check warranty: untuk check product warranty","Pengurutan Input: Product Tower / Product Group / Product Type / Product Line / Product Number / Product Name"]
            }),}},
            {element: '#warranty', popover: {title: 'Menu Warranty',description: TextList({
                list: ["Pilihlah opsi warranty status: sesuai dengan status unit tersebut", "EOW Date: tanggal unit warranty", "Apabila ingin mengajukan garansi kembali, maka: checklist need warranty approval ketika warranty status 01 Trade (OOW)"]
            }),}},
            {element: '#accessories', popover: {title: 'Menu Accessories (Opsional)',description: TextList({
                list: ["Pilihlah Opsi Accesories, apabila unit yang diberikan terdapat accessories", "Note: untuk mendeskripsikan kondisi accessories tersebut", "CT/SN: Kode number accessories tersebut"]
            }),}},
            {element: '#photos', popover: {title: 'Menu Photo (Opsional)',description: "Upload unit jika diperlukan"}},
        ],
        "/app/flowcase": [
            {element: '#Finish', roles:["fd","admin"],  popover: {title: 'Menu Filter Case Finish',description: ""}},
            {element: '#Close', roles:["fd","admin"], popover: {title: 'Menu Filter Case Close',description: ""}},
            
        ],
        "/app/case": [
            {element: '#case-subject', roles:["fd","admin"], popover: {title: 'Field Case Subject',description: "Ini Case Subject"}},
            {element: '#case-status', roles:["fd","admin"], popover: {title: 'Field Case Status',description: "Ini Case Status"}},
            {element: '#case-type', roles:["fd","admin"], popover: {title: 'Field Case Type',description: "Ini Case Type"}},
            {element: '#problem-desc', roles:["fd","admin"], popover: {title: 'Field Problem Desc',description: "Ini Problem Desc"}},
            {element: '#case-priority', roles:["fd","admin"], popover: {title: 'Field Case Priority',description: "Ini Case Priority"}},
            {element: '#customer-issue', roles:["fd","admin"], popover: {title: 'Field Customer Issue',description: "Ini Customer Issue"}},
            {element: '#log-type', roles:["fd","admin"], popover: {title: 'Field Log Type',description: "Ini Log Type"}},
            {element: '#action-type', roles:["fd","admin"], popover: {title: 'Field Action Type',description: "Ini Action Type"}},
            {element: '#notes', roles:["fd","admin"], popover: {title: 'Field Note',description: "Ini Note"}},
        ],
        "/app/work": [
            {element: '#uknown', popover: {title: 'lol Photo (Opsional)',description: "Upload unit jika diperlukan"}},
        ],
        "/app/material-order": [
            {element: '#uknown', popover: {title: 'lol Photo (Opsional)',description: "Upload unit jika diperlukan"}},
        ],
        "/app/mo_detail": [
            {element: '#uknown', popover: {title: 'lol Photo (Opsional)',description: "Upload unit jika diperlukan"}},
        ]
    }

    let pageStep = StepByPage[location.pathname] || [];

    if (location.pathname.startsWith("/app/case")) {
        pageStep = StepByPage["/app/case"]
    }
    if (location.pathname.startsWith("/app/work")) {
        pageStep = StepByPage["/app/work"]
    }
    if (location.pathname.startsWith("/app/material-order")) {
        pageStep = StepByPage["/app/material-order"]
    }
    if (location.pathname.startsWith("/app/mo_detail")) {
        pageStep = StepByPage["/app/mo_detail"]
    }

      const filterStepRoll = pageStep.filter((step) => {
        if(!step.roles) {
            return true;
        }
        return step.roles.includes(user.role)
      })

    const driverObj = driver({
        onPopoverRender: (popover, { config, state }) => {
            const firstButton = document.createElement("button");
            firstButton.innerText = "Go to First";
            popover.footerButtons.appendChild(firstButton);

            firstButton.addEventListener("click", () => {
            driverObj.drive(0);
            });
        }, 
        showProgress: true,
        smoothScroll: true,
        steps: filterStepRoll
        
    });
    
    return (
        <>
            <Button title={"Guidline"} variant={"outline"} className={"cursor-pointer dark:border-b-slate-500 dark:bg-gradient-to-b dark:from-slate-600 dark:via-slate-800 dark:to-slate-700"} onClick={() => driverObj.drive()}>
                <OctagonAlert/>
            </Button>
        </>
    )
}

