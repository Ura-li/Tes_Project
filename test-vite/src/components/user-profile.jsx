import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ApiCustomer from "@/api";
import Swal from "sweetalert2";
import { FormLabel } from "./ui/form";


export function UserProfile({user}) {
    const [formData, setFormData] = useState({
        Username: user.Username,
        Name: user.Name,
        Email: user.Email,
        Phone: user.Phone || "",
        NewPassword: "",
        ProfilePhoto: null,
        Signature: null,
    })
    const [preview, setPreview] = useState({
        ProfilePhoto: null,
        Signature: null,
    });

    useEffect(() => {
        const fetchUser = async () => {
            Swal.fire({
                title: "Memuat Data User...",
                text: "Mohon tunggu sebentar",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                Swal.showLoading();
                },
            });
            try{
                const getResFromUser = await ApiCustomer.get(`/api/user/${user.id}`);
                
                if(getResFromUser.data.success){
                    Swal.close()
                    const res = getResFromUser.data.data;
                    setFormData({
                        ...formData,
                        Username: res.Username,
                        Name: res.Name,
                        Email: res.Email,
                        Phone: res.Phone || "", 
                        ProfilePhoto: res.ProfilePhoto,
                        Signature: res.Signature,
                    })
                    setPreview({
                        ProfilePhoto: res.ProfilePhoto ? `${import.meta.env.VITE_API_BASE_URL}${res.ProfilePhoto}` : null,
                        Signature: res.Signature ? `${import.meta.env.VITE_API_BASE_URL}${res.Signature}` : null,
                    });
                }  

            }catch(err){
                Swal.close()
                console.error(err)
            }
        }
        
        if(user?.id) fetchUser();
    }, [user?.id])


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
        const file = files[0];
        setFormData((prev) => ({
            ...prev,
            [name]: file,
        }));
        setPreview((prev) => ({
            ...prev,
            [name]: URL.createObjectURL(file),
        }));
        } else {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if(value) fd.append(key, value)
        })
        for (let pair of fd.entries()) {
            console.log(pair[0], pair[1]);
        }


        try {
            const res = await ApiCustomer.patch(`/api/user/${user.id}`, fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
             if (res.data.data) {
                localStorage.setItem("token", res.data.token);
                Swal.fire("data berhasil diupdate");
            }
            
        } catch (error) {
            Swal.fire("Error : "+ error);
        }
            
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
            <label>Username</label>
            <Input name="Username" value={formData.Username} disabled />
            <label>Name</label>
            <Input name="Name" value={formData.Name} onChange={handleChange} placeholder="Full Name" />
            <label>Email</label>
            <Input name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" />
            <label>Phone</label>
            <Input name="Phone" value={formData.Phone} onChange={handleChange} placeholder="Phone Number" />
            <label>Password</label>
            <Input type="password" name="NewPassword" value={formData.NewPassword} onChange={handleChange} placeholder="New Password" />
            
            <label>Profile Photo</label>
            <Input type="file" name="ProfilePhoto" onChange={handleChange} />
            {preview.ProfilePhoto && (
            <img src={preview.ProfilePhoto} alt="Profile Preview" className="mt-2 h-24 w-24 object-cover rounded-full border" />
            )}
            
            <label>Signature</label>
            <Input type="file" name="Signature" onChange={handleChange} />
            {preview.Signature && (
            <img src={preview.Signature} alt="Signature Preview" className="mt-2 h-16 object-contain border" />
            )}


            <Button type="submit">Save Changes</Button>
        </form>
    );
}
