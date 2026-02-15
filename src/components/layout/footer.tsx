import Link from "next/link";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200">
              <Code2 className="h-4 w-4 text-zinc-950" />
            </div>
            <span className="font-bold text-white">Py2Nb</span>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            Transformez vos scripts Python en notebooks Jupyter professionnels
            avec l&apos;IA.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-zinc-300">Produit</h4>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li>
              <Link href="/" className="hover:text-zinc-300">
                Convertir
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-zinc-300">
                Tarifs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-zinc-300">Legal</h4>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li>
              <Link href="#" className="hover:text-zinc-300">
                CGU
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-zinc-300">
                Confidentialite
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-zinc-300">Contact</h4>
          <p className="text-sm text-zinc-500">contact@py2nb.com</p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-zinc-800 px-4 pt-8">
        <p className="text-center text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} Py2Nb. Tous droits reserves.
        </p>
      </div>
    </footer>
  );
}
