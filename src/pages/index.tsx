import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import backgroundImage from "~/assets/background.jpg";
import { RegisterForm, TokenForm } from "~/forms";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [tokenText, setTokenText] = useState('');

  const [token, setToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  useEffect(() => {
    if (router.query.token) {
      setTokenText(router.query.token as string);
    }
  }, []);

  const tokenSchema = z.object({
    token: z.string().uuid().nonempty(),
  });
  const registerSchema = z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty(),
    password2: z.string().nonempty(),
    token: z.string().uuid().nonempty(),
  }).refine(({ password, password2 }) => (password === password2), {
    message: "Passwords not matched",
    path: ["password2"]
  });

  const [schema, setSchema] = useState<z.Schema>(tokenSchema);
  useEffect(() => {
    if (isTokenValid) {
      setSchema(registerSchema);
    } else {
      setSchema(tokenSchema);
    }
  }, [isTokenValid]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm | TokenForm>({
    resolver: zodResolver(schema)
  });

  const verifyToken = async (token: string) => {
    const response = await api.token.verify.useQuery({
      token,
    });
    if (response.data?.valid) {
      setIsTokenValid(true);
    } else {
      setIsTokenValid(false);
    }
  };

  const onSubmit = async (data: RegisterForm | TokenForm) => {
    setIsLoading(true);

    if (!isTokenValid) {
      // verify token
      const isValid = await verifyToken(data.token);
      setIsLoading(false);
      return;
    }

    // register
  }

  return (
    <>
      <Head>
        <title>Get your NIMO.wiki account</title>
        <meta name="description" content="Get your NIMO.wiki account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen h-screen flex flex-row">
        <div className="banner hidden md:block flex-1 relative">
          <Image
            className="object-cover w-full h-full"
            src={backgroundImage}
            alt="Picture token by Brett Sayles downloaded from pexels.com" />

          <div className="mask h-full w-full top-0 left-0 absolute bg-black/40">
          </div>
        </div>

        <div className="w-full md:w-auto px-8 py-8 bg-slate-700 flex items-center justify-center">
          <div>
            <h1 className="text-white text-2xl mb-8 text-center font-semibold">
              Get your <a href="https://nimo.wiki" className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-violet-500">NIMO.wiki</a> account
            </h1>
            <div className="w-96 shadow rounded border border-gray-100/10 
                          bg-white/20 backdrop-blur-md px-6 py-6 relative
                            transition-all">
              {isLoading ? (
                <div className="bg-white/60 backdrop-blur-lg
                                flex items-center justify-center
                                top-0 left-0 absolute w-full h-full z-10 rounded">
                  <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleSubmit(d => console.log('hello'))}>
                {isTokenValid ? (
                <>
                  <div className="mb-4">
                    <label html-for="username" className="block mb-2 text-sm font-medium text-white">Username</label>
                    <input type="username" id="email"
                      {...register("username", { required: true })}
                      className="border border-gray-600 text-sm rounded-lg 
                                  block w-full p-2.5 bg-gray-700 placeholder-gray-400 
                                  text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="nimoer" required />
                  </div>
                  <div className="mb-4">
                    <label html-for="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                    <input type="password" id="password"
                      {...register("password", { required: true })}
                      className="border text-sm rounded-lg block w-full p-2.5 
                                bg-gray-700 border-gray-600 placeholder-gray-400 
                                text-white focus:ring-blue-500 focus:border-blue-500" 
                      required />
                  </div>
                  <div className="mb-4">
                    <label html-for="password2" className="block mb-2 text-sm font-medium text-white">Confirm Password</label>
                    <input type="password" id="password2"
                      {...register("password2", { required: true })}
                      className="border text-sm rounded-lg block w-full p-2.5 
                        bg-gray-700 border-gray-600 placeholder-gray-400 
                        text-white focus:ring-blue-500 focus:border-blue-500" 
                      required />
                    {(errors as FieldErrors<RegisterForm>).password2 && <span className="text-red-500 text-sm">{(errors as FieldErrors<RegisterForm>).password2?.message}</span>}
                  </div>
                </>
                ) : null}
                <div className="mb-4">
                  <label html-for="token" className="block mb-2 text-sm font-medium text-white">Token</label>
                  <input type="text" id="token" className="border border-gray-600 text-sm rounded-lg block w-full p-2.5 bg-gray-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" 
                  {...register("token")}
                  value={tokenText}
                  onChange={e => setTokenText(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" required />
                  {errors.token && <span className="text-red-500 text-sm">{errors.token.message}</span>}
                </div>
                <button type="submit" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
                  {isTokenValid ? 'Create 🚀' : 'Verify ✨'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;