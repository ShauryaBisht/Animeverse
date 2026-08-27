import {supabase} from '../lib/supabase'


export const signUpUser=async(email:string,password:string,fullName:string)=>{
    const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data:{
        full_name:fullName,
      },
    },
  })
  if (error) throw error;
  return data;
}

export const signInUser=async(email:string,password:string)=>{
    const {data,error}=await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if(error) throw error
    return data
}

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};