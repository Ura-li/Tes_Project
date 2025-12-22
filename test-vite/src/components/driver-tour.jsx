import { driver } from 'driver.js';
import { Button } from './ui/button';
import { OctagonAlert } from 'lucide-react';
import { useLocation } from 'react-router';
import { useAuth } from '../context/auth-context';
import "driver.js/dist/driver.css";
import { description } from './sc-chart';


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
            {element: '#sidebar', roles:['fd','ps','admin','apo','ce','lg','celead','cm'], popover: 
                {title: 'Sidebar',description: {
                    fd: `<div style="font-weight:600;margin-bottom:6px">Fungsi Sidebar: </div>
                    ${TextList({
                        list: [
                            'Home: Halaman utama untuk melihat ringaksan dan navigasi aplikasi.',
                            'Your Cases: Menampilkan daftar kasus yang sedang ditangani oleh anda.',
                            'ERF Case: .',
                            'My Work: Berisi tugas atau pekerjaan yang pelu anda kerjakan atau tindak lanjuti.',
                            'View Case: Digunakan untuk mencari & melihat detail kasus yang sudah ada.',
                            'Master Fd: Digunakan untuk Mengelolah data uatam seperti Company, Assets, dan Contact yang akan dipakai saat membuat atau memproses Case.',
                            'Profil User : Menampilkan informasi akun yang sedang login dan digunakan untuk mengakses pengaturan akun atau logout.'
                        ]
                    })}`,
                    ps: `<div style="font-weight:600;margin-bottom:6px">Fungsi Sidebar: </div>
                    ${TextList({
                        list: [
                            'Home: Halaman utama untuk melihat ringaksan dan navigasi aplikasi.',
                            'Your Cases: Menampilkan daftar kasus yang sedang ditangani oleh anda.',
                            'View Case: Digunakan untuk mencari & melihat detail kasus yang sudah ada.',
                            'Profil User : Menampilkan informasi akun yang sedang login dan digunakan untuk mengakses pengaturan akun atau logout.'
                        ]
                    })}`,
                    lg: `<div style="font-weight:600;margin-bottom:6px">Fungsi Sidebar: </div>
                    ${TextList({
                        list: [
                            'Home: Halaman utama untuk melihat ringaksan dan navigasi aplikasi.',
                            'Your Cases: Menampilkan daftar kasus yang sedang ditangani oleh anda.',
                            'RMA: Digunakan untuk update RMA melalui upload data SO/RMA menggunakan template.',
                            'Profil User : Menampilkan informasi akun yang sedang login dan digunakan untuk mengakses pengaturan akun atau logout.'
                        ]
                    })}`,
                }[({
                    ps: 'ps', ce: 'ps', lg: 'lg', apo: 'ps', celead: 'ps',cm: 'ps', admin: 'fd', fd: 'fd'
                })[user.role]], side: 'bottom', align: 'center'}},
            {element: '#icsidebar', popover: {title: 'Sidebar Trigger',description: 'Gunakan tombol ini untuk membuka atau menutup sidebar.', side: 'right', align: 'center'}},
            {element: '#breadcrumbs', popover: {title: 'Breadcrumbs',description: 'Menunjukan posisi halaman anda saat ini', side: 'bottom', align: 'center'}}, 
            {element: '#global-search', popover: {title: 'Global Search',description: 'Fitur pencarian cepat untuk menemukan data atau kasus dengan cepat,', side: 'bottom', align: 'center'}},
            {element: '#three-button', popover: {title: 'Three Button',description: 'Gunakan Tombol di bagian ini untuk melihat guide, mengatur tampilan, notifikasi.', side: 'bottom', align: 'center'}},
            {element: '#dashboard', roles: ['fd','celead','ce','apo','lg','cm'], popover: {title: 'Dashboard',description: "Ini adalah halaman utama untuk memantau aktivitas dan status kasus Anda hari ini.", side: 'bottom', align: 'center'}},
            {element: '#storage-list', roles:['ps'], popover: {title: 'Storage List', description: 'Pilih storage di sini untuk melihat detail data yang tersimpan.', side: 'top'}},
            {element: '#storage-card', roles:['ps'], popover: {title: 'Storage Info', description: 'Disini Anda dapat melihat Daftar Perangkat yang terdaftar di akun Anda lengkap dengan Serial number, model perangkat, dan status garansi.', side: 'top'}},
            {element: '#profile', roles:['fd','celead','ce','apo','lg','cm'] ,popover: {title: 'Profil Users',description: "Menampilkan informasi profil pengguna yang sedang login."}},
            {element: '#cases-overview', roles:['fd','celead','ce'], popover: {title: 'Ringkasan Kasus', description: 'Menampilkan jumlah kasus berdasarkan statusnya seperti Open, In Progress, dan Closed.', side: 'right'}},
            {element: '#notifications', roles:['fd','celead','ce','apo','lg','cm'], popover: {title: 'Notifikasi', description: 'Menampilkan pemberitahuan terbaru terkait aktivitas kasus Anda.', side: 'left'}},
            {element: '#recent-case', roles:['fd','celead','ce','apo'], popover: {title: 'Kasus Terbaru', description: 'Daftar kasus terbaru yang masuk dan perlu segera ditindak lanjuti.\n\n' + TextList({
                list: ["Lihat Id dan judul case.", "Check prioritas dan status.", "klik case untuk melihat detail"]
            }), side: 'top'}},
            {element: '#sparepart', roles:['lg'], popover: {title: 'Sparepart', description: 'Daftar permintaan sparepart yang perlu Anda setujui.' + TextList({
                list: ["Lihat nomor Mo, Status, dan detail sparepart.", "Gunakan filter status untuk menyaring data.", "Export sparepart untuk melihat detail.", "Klik sparepart untuk melihat detail."]
            }), side: 'top'}},
            {element: '#quotation', roles:['cm'], popover: {title: 'Quotation', description: 'Daftar quotation yang sedang diproses.' + TextList({
                list: ["Lihat nomor Quotation, Status, dan detail quotation.", "Perlihatkan prioritas dan status quotation.", "Klik Quotation untuk melihat detail lengkap."]
            }), side: 'top'}},
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
            {element: '#your-case', popover: {title: 'Menu Your Case',description: "Halaman ini menampilkan daftar kasus yang ditugaskan kepada Anda dan perlu dipantau atau ditindaklanjuti.", side: 'bottom', align: 'center'}},
            {element: '#case-toggle', roles: ["fd","admin"], popover: {title: 'Filter Case',description: TextList({
                list: ['Show Finished Case : Menampilkan Case yang telah selesai.', 'Show Closed Case : Menampilkan Case yang telah ditutup.']
            }), side: 'bottom', align: 'center'}},
            {element: '#case-card', popover: {title: 'Informasi Case',description: TextList({
                list: ['Case Id dan nama produk.', 'Informasi customer atau perusahaan.','Tanggal pembuatan dan update terakhir.','Status dan badge case.']
            }) + 'Klik case untuk melihat detail.', side: 'top'}},
            {element: '#case-badge', popover: {title: 'Status & Case Badge', description: 'Case badge digunakan untuk menandai kondisi, status case, dan informasi penting dari setiap case.\n' + 'Jenis badge yang dapat ditampilkan dapat berbeda tergantung case dan peran user', side: 'top', align: 'center'}},
            {element: '#case-search', popover: {title: 'Search Sidebar',description : 'Gunakan fitur Search untuk mencari dan menyaring case berdasarkan informasi utama.', side: 'top', align: 'center'}},
            {element: '#case-time', popover: {title: 'Data Time',description: 'Menampilkan informasi waktu terkait data case yang sedang ditampilkan.', side: 'top', align: 'center'}},
            {element: '#case-pagination', popover: {title: 'Pagination',description: 'Gunakan navigasi ini untuk berpindah antar halaman daftar case.', side: 'top', align: 'center'}},
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

