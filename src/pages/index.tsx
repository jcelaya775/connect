import Head from "next/head";
import Image from "next/image";
import Header from '@/components/Header'
import style from '@/styles/FormBox.module.css'
import logo from '@/images/link_icon_content.svg'
import Link from 'next/link'

export default function Home() {
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
						  <img className={style.logo} src={logo} alt=""></img>
					  </h1>
					  <h3>
						  The Social Media Hub
					  </h3>
					  <Link href="/login">
						  <button className={style.button}>
							  Login
						  </button>
					  </Link>
					  <a href="/signup" >
						  <button className={style.button}>
							  Sign Up
						  </button>
					  </a>
				  </div>
			  </div>
	  </>
	);
  }
  