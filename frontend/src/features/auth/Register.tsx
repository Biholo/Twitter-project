import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "@/validators/authValidators";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRegister } from "@/api/queries/authQueries";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import unicornLogo from "@/assets/icons/unicorn-logo.svg";
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: _isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: registerUser, isPending } = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      registerUser(data);
    } catch (error) {
      console.error(error);
    }
  };

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
            <img
              src={unicornLogo}
              alt="Unicorn Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 transform hover:scale-110 transition-transform duration-300"
            />
          </motion.div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium text-gray-700">
            Inscription
          </h2>
          <p className="mt-2 text-sm text-gray-500">Créez votre compte</p>
        </div>

        <form
          className="mt-6 sm:mt-8 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <Input
              label="Username"
              {...register("username")}
              error={errors.username?.message}
              placeholder="Username"
              className="w-full px-3 py-2 rounded-xl border border-pink-100 bg-white/80 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-all placeholder:text-gray-400"
            />
            <Input
              label="Identifier Name"
              {...register("identifierName")}
              error={errors.identifierName?.message}
              placeholder="@username"
              className="w-full px-3 py-2 rounded-xl border border-pink-100 bg-white/80 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-all placeholder:text-gray-400"
            />
            <Input
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              placeholder="votre@email.com"
              className="w-full px-3 py-2 rounded-xl border border-pink-100 bg-white/80 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-all placeholder:text-gray-400"
            />
            <Input
              label="Mot de passe"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-pink-100 bg-white/80 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-all placeholder:text-gray-400"
            />
            <Input
              label="Confirmer le mot de passe"
              type="password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-pink-100 bg-white/80 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-all placeholder:text-gray-400"
            />
          </div>

          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            loadingText="Inscription en cours..."
            className={`w-full py-2.5 sm:py-3 bg-gradient-to-r from-pink-400 to-blue-400 text-white rounded-xl font-medium
            hover:from-pink-500 hover:to-blue-500 transform transition-all duration-200
            focus:ring-2 focus:ring-pink-200 focus:ring-offset-2 disabled:opacity-50
            ${isPending ? "animate-pulse" : ""}`}
          >
            S'inscrire
          </Button>

          <div className="text-sm text-center mt-4 sm:mt-6">
            <Link
              to="/login"
              className="font-medium text-pink-500 hover:text-blue-500 transition-colors duration-300 hover:underline"
            >
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
