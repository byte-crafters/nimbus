'use server'

export async function authenticate(formData: FormData) {
      try {
            // await signIn("credentials", formData);
            console.log(formData)
      } catch (error: any) {
            if (error) {
                  switch (error.type) {
                        case 'CredentialsSignin':
                              return 'Invalid credentials.'
                        default:
                              return 'Something went wrong.'
                  }
            }
            throw error
      }
}
