import Head from "next/head";
import Image from "next/image";
import Header from '@/components/Header'
import style from '@/styles/FormBox.module.css'
import logo from '@/images/link_icon_content.svg'
import Link from 'next/link'

export default function Home({ data }: any) {
	console.log(data)
	
	return (
	  <>
		<Head>
		  <title>Connect</title>
		  <meta name="description" content="Social media hub that is the home to all of your social media needs." />
		  <meta name="viewport" content="width=device-width, initial-scale=1" />
		  <link rel="icon" href="/favicon.ico" />
		</Head>
		<Header />
  
		<div className={style.container}>
				  <div>
					  <h1>Connect
						  <Image className={style.icon} src={logo} alt=""></Image>
					  </h1>
					  <h3>
						  The Social Media Hub
					  </h3>
					  <Link href="/login">
						  <button className={style.button}>
							  Login
						  </button>
					  </Link>
					  <Link href="/signup" >
						  <button className={style.button}>
							  Sign Up
						  </button>
					  </Link>
				  </div>
			  </div>
	  </>
	);
  }
  
export async function getStaticProps() {
	const res = await fetch("http://localhost:3000/api/users")
	const json = await res.json()

	return {
		props: {
			data: json,
		}
	}
}