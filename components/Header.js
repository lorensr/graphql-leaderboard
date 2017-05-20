import Link from 'next/link'

export default ({ pathname }) => (
  <header>
    <Link prefetch href='/'>
      <a className={pathname === '/' && 'is-active'}>Home</a>
    </Link>

    <Link prefetch href='/about'>
      <a className={pathname === '/about' && 'is-active'}>About</a>
    </Link>

    <style jsx>{`
      header {
        margin-bottom: 25px;
      }
      a {
        font-size: 14px;
        margin-right: 15px;
        text-decoration: underline;
      }
      .is-active {
        text-decoration: none;
      }
    `}</style>
  </header>
)
