import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

import ApiCustomer from "@/api"
import Swal from "sweetalert2"

export function LoginForm({
  className,
  ...props
}) {

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
      title: 'Logging in...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
      const res = await ApiCustomer.post('/api/auth/login',{
        identifier,
        password
      })
      console.log('Login success:', res.data);
      const { token } = res.data;
      localStorage.setItem('token', token);

      Swal.fire({
      title: "Success",
      icon: "success",
      allowOutsideClick: false,
      timer: 1500, 
      showConfirmButton: false,
      allowEscapeKey: false,
      }).then((result) => {
        window.location.href = '/app';
      });
    } catch (error) {
      console.error('Login failed:', error);
      Swal.fire('Error', 'Login Failed', 'error');
    }
  }

  /**
   * TODO :
   */
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back Patner</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Company Inc account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>

            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/hp.png"
              alt="Image"
              className="p-10 mt-5" />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
