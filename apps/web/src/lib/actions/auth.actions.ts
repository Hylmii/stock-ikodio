'use server'


import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";

export const signUpWithEmail = async({email,password,fullName,country,investmentGoals,riskTolerance,preferredIndustry} :SignUpFormData) =>{
    try {
        const response = await auth.api.signUpEmail({
            body:{email, password,name: fullName}
        })

        if(response && process.env.INNGEST_EVENT_KEY){
            // Only send Inngest event if API key is configured
            try {
                await inngest.send({
                    name:'app/user.created',
                    data:{
                        email,
                        name: fullName,
                        country,
                        investmentGoals,
                        riskTolerance,
                        preferredIndustry,
                    }
                })
            } catch (inngestError) {
                console.warn('Inngest event failed (non-critical):', inngestError);
            }
        }

        return {success:true,data:response};
        
    } catch (error) {
        console.log('Sign Up failed', error);
        return {success:false, message:'Sign Up failed. Please try again.'};
        
    }
}


export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign in failed', e)
        return { success: false, error: 'Sign in failed' }
    }
}

export const signOut = async () =>{
    try {
        await auth.api.signOut({headers: await headers()})
        
    } catch (error) {
        console.log('Sign out failed', error);
        return {success: false, error:'Sign out failed'}
        
    }
}