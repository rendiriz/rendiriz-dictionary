import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Disclosure } from '@headlessui/react';
import { CgClose, CgMenu } from 'react-icons/cg';
import cn from 'classnames';
import { signIn, signOut, useSession } from 'next-auth/react';

import { site } from '@/lib/site';
import ThemeSwitcher from '@/components/ThemeSwitcher';

type TNavItem = {
  className?: string;
  icon?: JSX.Element;
  href: string;
  text: string;
};

const NavItem = (props: TNavItem) => {
  const router = useRouter();
  const isActive = router.asPath === props.href;

  return (
    <Link href={props.href}>
      <a
        className={cn(
          isActive
            ? 'text-blue-700 dark:text-blue-500'
            : 'text-gray-800 dark:text-gray-50',
          'flex space-x-2 font-medium py-4 px-4',
          props.className,
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {props.icon}
        <span>{props.text}</span>
      </a>
    </Link>
  );
};

const NavItemMobile = (props: TNavItem) => {
  const router = useRouter();
  const isActive = router.asPath === props.href;

  return (
    <Link href={props.href}>
      <Disclosure.Button
        as="a"
        className={cn(
          isActive
            ? 'bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-500'
            : 'text-gray-800 dark:text-gray-50',
          'flex space-x-2 font-medium py-4 px-4',
          props.className,
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {props.icon}
        <span>{props.text}</span>
      </Disclosure.Button>
    </Link>
  );
};

const NavAuth = () => {
  const { data: session } = useSession();

  return (
    <Link
      href={!session ? '/api/auth/signin/google' : '/api/auth/signout/google'}
    >
      <a
        className={cn(
          'px-5 py-2.5',
          'text-white bg-blue-700 dark:bg-blue-600',
          'enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-700',
          'flex items-center justify-center rounded-lg transition-all',
          'font-medium text-sm',
        )}
        onClick={(e) => {
          e.preventDefault();
          if (!session) {
            signIn('google');
          } else {
            signOut({
              callbackUrl: `${window.location.origin}`,
            });
          }
        }}
      >
        {!session ? 'Sign In' : 'Sign Out'}
      </a>
    </Link>
  );
};

const Navbar = () => {
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();

  const color = resolvedTheme === 'dark' ? '#FAFAF9' : '#292524';

  return (
    <Disclosure
      as="nav"
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4">
            <div className="relative flex flex-wrap items-center justify-between py-2">
              <div className="flex items-center">
                <Link href={'/'}>
                  <a className="text-xl text-gray-800 no-underline whitespace-nowrap py-2">
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 66C0 57.1634 7.16344 50 16 50H50V100H0V66Z"
                        fill={color}
                      />
                      <path
                        d="M100 0L100 50L66 50C57.1634 50 50 42.8366 50 34L50 -2.18557e-06L100 0Z"
                        fill={color}
                      />
                      <path
                        d="M0 0H34C42.8366 0 50 7.16344 50 16V50H0V0Z"
                        fill={color}
                      />
                    </svg>
                  </a>
                </Link>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-1">
                    <NavItem href="/" text="Home" />
                    {session && (
                      <NavItem href="/dictionary" text="Dictionary" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1 sm:space-x-2 md:space-x-4 items-center">
                <div className="sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 dark:text-gray-50 hover:bg-gray-50 hover:dark:bg-gray-800">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <CgClose className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <CgMenu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <ThemeSwitcher />
                <div className="hidden sm:block">
                  <div className="flex space-x-1">
                    <NavAuth />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="absolute w-full bg-white dark:bg-gray-900 sm:hidden mt-[1px] border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col">
              <div className="space-y-1 py-6">
                <NavItemMobile href="/" text="Home" />
                {session && (
                  <NavItemMobile href="/dictionary" text="Dictionary" />
                )}
              </div>
              <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid">
                  <NavAuth />
                </div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
