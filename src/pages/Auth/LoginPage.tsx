import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthContext from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(5).max(50),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    if (values.username === "admin" && values.password === "admin") {
      setIsAuthenticated(true);
      navigate("/");
    } else {
      form.setError("password", {
        type: "manual",
        message: "Wrong username or password",
      });
      form.setError("username", {
        type: "manual",
        message: "Wrong username or password",
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-200 bg-gradient-to-r from-gray-500 to-white rounded-md shadow-2xl"
        >
          <fieldset className="border border-gray-300 px-12 py-8 space-y-10 w-100 max-w-screen bg-white">
            <div className="text-center text-xl font-bold">
              Welcome !!
              <div className="font-light text-sm text-gray-500/80">
                Please login to continue
              </div>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 "
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                  <FormDescription>
                    * username: admin , password: admin
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
