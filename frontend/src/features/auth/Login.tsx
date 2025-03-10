import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/validators/authValidators"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useLogin } from "@/api/queries/authQueries"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import unicornLogo from '@/assets/icons/unicorn-logo.svg'
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate: loginUser, isPending } = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    try {
      loginUser(data);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <Card className="w-full max-w-xl mx-2 p-4 sm:p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-soft border border-pink-100">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto h-16 sm:h-20 w-16 sm:w-20 rounded-2xl flex items-center justify-center"
          >
            <img src={unicornLogo} alt="Unicorn Logo" className="w-12 h-12 sm:w-16 sm:h-16 transform hover:scale-110 transition-transform duration-300" />
          </motion.div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium text-gray-700">Connexion</h2>
          <p className="mt-2 text-sm text-gray-500">Bienvenue sur notre plateforme</p>
        </div>

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Input
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              placeholder="votre@email.com"
              className="w-full px-5 py-3 rounded-xl border border-pink-100 bg-white/80 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-all placeholder:text-gray-400"
            />
            <Input
              label="Mot de passe"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl border border-pink-100 bg-white/80
              focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-all placeholder:text-gray-400"
            />
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            loadingText="Connexion en cours..."
            className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-blue-400 text-white rounded-xl font-medium
            hover:from-pink-500 hover:to-blue-500 transform transition-all duration-200
            focus:ring-2 focus:ring-pink-200 focus:ring-offset-2 disabled:opacity-50"
          >
            Se connecter
          </Button>

          <div className="text-sm text-center mt-8">
            <Link
              to="/register"
              className="font-medium text-pink-500 hover:text-blue-500 transition-colors duration-300"
            >
              Pas encore de compte ? S'inscrire
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

