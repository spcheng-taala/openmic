import React, { Component } from 'react';

const tileData = [
  {
    text: "Information We Collect",
    type: "title",
  },
  {
    text: "When you interact with our Site or App, we collect information that, alone or in combination with other information, could be used to identify you (“Personal Data”)",
    type: "text",
  },
  {
    text: "1.Personal Data You Provide Us",
    type: "title",
  },
  {
    text: "A.Account Information",
    type: "title",
  },
  {
    text: "Some information is required to create an account on our Services, such as your name, email address, password. You may also choose to provide other types of information to make public on the Services, such as a profile photo, biography, country information, your website, and community username.",
    type: "text",
  },
  {
    text: "B.Social Media",
    type: "title",
  },
  {
    text: "You may connect to the Services using credentials from social media services such as Facebook or Twitter (“Social Media Services”). When you provide OpenMic access to your Social Media Services account, we will collect relevant information necessary to enable the Services to access that Social Media Service, however you will provide your login information, like your password, directly to such Social Media Service (and not to OpenMic).",
    type: "text",
  },
  {
    text: "To access your Social Media Services account, we provide a link that directs you to a Social Media Service, where you may access the Services directly. As part of the integration with the Services, the Social Media Service will provide OpenMic with access to certain information that you have provided to such Social Media Service, including for example to post-related meta data from your Twitter feed or Facebook wall (such as post type, date of creation, date of update, post creator, permanent link, and the number of “Likes” and “Comments”), and “friends” or other Users you are “following”.",
    type: "text",
  },
  {
    text: "OpenMic does not download, save, or store your photos, videos, or status messages posted on your Social Media Services accounts unless you grant us permission to do so. We will use, store and disclose such information in accordance with this Privacy Policy and, if and to the extent applicable, the policies of such Social Media Services.",
    type: "text",
  },
  {
    text: "When you elect to access and use the Social Media Services, you will be sharing your information (which will include personal information if you elect to share such information) with those Social Media Services and others on the Social Media Services platform. We are not responsible for the privacy practices of Social Media Services and any the information you share with them is subject to their privacy policies and terms of service. As a result, OpenMic shall not have any liability or responsibility for the privacy practices or other actions of Social Media Services that may be enabled within or otherwise accessible through the Services.",
    type: "text",
  },
  {
    text: "You may be able to adjust your privacy settings with these Social Media Services to control what information the services disclose to other entities, including OpenMic. We suggest checking the privacy policies of the Social Media Services concerning their privacy settings and controls.",
    type: "text",
  },
  {
    text: "C.Posts, Following, Lists and other Public Information",
    type: "title",
  },
  {
    text: "The Services are primarily designed to help you share information with the world. Most of the information you provide us through the Services is information you are asking us to make public.",
    type: "text",
  },
  {
    text: "Your public information includes the (i) messages you post; the metadata provided with such posts, such as when you posted and the application you used to post; (ii) language, country, and time zone associated with your account; and (iii) lists you create, people you follow, posts you mark as likes, and many other bits of information that result from your use of the Services. Our default is almost always to make the information you provide through the Services public for as long as you do not delete it.",
    type: "text",
  },
  {
    text: "The Services broadly and instantly disseminate your public information to a wide range of users, customers, and services. For instance, your public user profile information and public posts are immediately delivered via RSS feeds and our APIs to our partners and other third parties, including search engines, developers, and publishers that integrate the Services content into their services, and institutions such as universities and public health agencies that analyze the information for trends and insights. When you share information or content via the Services, you should think carefully about what you are making public.",
    type: "text",
  },
  {
    text: "D.Additional Information",
    type: "title",
  },
  {
    text: "You may choose to upload your address book so that we can help you find Users you know or help other Users find you. We may later make suggestions to you and other Users based on imported address book contacts. You can delete your imported address book contacts at any time.",
    type: "text",
  },
  {
    text: "If you email us, we may keep your message, email address and contact information to respond to your request. If you connect your account on our Services to your account on another service in order to cross-post between our Services and that service, the other service may send us your registration or profile information on that service and other information that you authorize. This information enables cross-posting, helps us improve the Services, and is deleted from our Services within a few weeks of your disconnecting your account on the other service from the Services account.",
    type: "text",
  },
  {
    text: "We also collect information you choose to provide to us when you complete any “free text” boxes in our forms (for example, support request or survey submission).",
    type: "text",
  },
  {
    text: "2.Information We Receive From Your Use of Our Services",
    type: "title",
  },
  {
    text: "When you use the Services, the following information is created and automatically logged in our systems:",
    type: "text",
  },
  {
    text: "Log data: Information (“log data”) that your browser automatically sends whenever you visit the Site, or that the App automatically sends when you use them. Log data includes your Internet Protocol (“IP”) address (so we understand which country you are connecting from when you visit the Site), browser type and settings, the date and time of your request, and how you interacted with the Services.",
    type: "text",
  },
  {
    text: "Cookies: Information from cookies stored on your device. Please see the “Cookies” section below to learn more about how we use cookies and other technologies.",
    type: "text",
  },
  {
    text: "Device information: Includes type of device you are using, operating system, settings, unique device identifiers, network information and other device-specific information. Information collected may depend on the type of device you use and its settings.",
    type: "text",
  },
  {
    text: "Usage Information: We collect information about how you use our Services, such as the types of content that you view or engage with, the features you use, the actions you take, the other Users you interact with and the time, frequency and duration of your activities.",
    type: "text",
  },
  {
    text: "How We User Information",
    type: "title",
  },
  {
    text: "We use your personal data for the following purposes:",
    type: "text",
  },
  {
    text: "To authenticate Users and provide the Service. This processing is necessary to perform the contract with you.",
    type: "text",
  },
  {
    text: "As necessary for certain legitimate business interests, which include the following:",
    type: "text",
  },
  {
    text: "·To respond to your inquiries and fulfill your requests for products and services;",
    type: "text",
  },
  {
    text: "·To customize our Services for you, including providing recommendations, personalized advertising and content (please read below to learn how we use Personal Data for targeted advertisement). For example, we use information on your use of Services features, including information that we obtain through cookies, to better understand your needs and interests in order to personalize your experience with our Services by presenting products and offers tailored to your interests. We use your public information and your location information (described above) to infer what topics you may be interested in, and to customize the content we show you, including ads, with more relevant content like local trends, stories, ads, and suggestions for people to follow;",
    type: "text",
  },
  {
    text: "·To send administrative information to you, for example, information regarding the Site or the App, and changes to our terms, conditions, and policies;",
    type: "text",
  },
  {
    text: "·To provide, maintain and improving the content and functionality of the Services. For example, we regularly fix bugs or user experience issues that may be tied to particular user accounts. We use cookies to analyze how Users interact with our Services. And that analysis can help us build better Services.",
    type: "text",
  },
  {
    text: "·To conduct research, and provide reporting to third parties;",
    type: "text",
  },
  {
    text: "·If you ask us to delete your data and we are required to fulfil your request, to keep basic data to identify you and prevent further unwanted processing;",
    type: "text",
  },
  {
    text: "·To prevent fraud or criminal activity, misuses of our products or services, and ensure the security of our IT systems, architecture and networks;",
    type: "text",
  },
  {
    text: "·To (a) comply with legal obligations and legal process, (b) respond to requests from public and government authorities including public and government authorities outside your country of residence; (c) enforce our Terms of Use; (d) protect our operations or those of any of our affiliates; (e) protect our rights, privacy, safety or property, and/or that of our affiliates, you or others; and (f) allow us to pursue available remedies or limit the damages that we may sustain, as required or permitted by the law.",
    type: "text",
  },
  {
    text: "For individuals in the EU, please see the “European Union (EU) Users” section below for information on what we mean by legitimate interests and your rights.",
    type: "text",
  },
  {
    text: "Marketing. We may contact you to tell you about services or products we believe will be of interest to you. If we do, where required by law, for example if you are a User in the European Union (“EU”), we will only send you marketing information if you consent to us doing so at the time you provide us with your Personal Data. You may opt-out of receiving such emails by following the instructions contained in each promotional email we send you or by updating your user settings. In addition, if at any time you do not wish to receive future marketing communications, please contact us at help@openmic.fm. We will continue to contact you via email regarding the provision of our Services and to respond to your requests.",
    type: "text",
  },
  {
    text: "Targeted Advertisement. OpenMic may display targeted advertisements based on Personal Data. Third parties (including ad serving companies) may assume that Users who interact with, view, or click targeted advertisements meet the targeting criteria (e.g., women ages 18–24 from a particular geographic area). OpenMic does not provide any Personal Data to the advertiser when a User interacts with or views a targeted advertisement. However, please be aware that by interacting with or viewing an advertisement the third party may make the assumption that you meet the targeting criteria used to display the advertisement.",
    type: "text",
  },
  {
    text: "Sharing and Disclosure of Information",
    type: "title",
  },
  {
    text: "We may share or disclose your information at your direction, such as when you authorize a third-party service to access your account or when you voluntarily share information or content via the Services. Other Users may share or disclose information about you, such as when they mention you.",
    type: "text",
  },
  {
    text: "There are certain circumstances in which we may share your Personal Data with certain third parties without further notice to you, unless required by the law, as set forth below:",
    type: "text",
  },
  {
    text: "·Vendors and Service Providers:To assist us in meeting business operations needs and to perform certain services and functions: providers of hosting, email communication and customer support services, analytics, marketing, advertising (for more details on the third parties that place cookies through the Site, please see the “Cookies” section below). Pursuant to our instructions, these parties will access, process or store Personal Data in the course of performing their duties to us.",
    type: "text",
  },
  {
    text: "·Business Transfers: If we are involved in a merger, acquisition, financing due diligence, reorganization, bankruptcy, receivership, sale of all or a portion of our assets, or transition of service to another provider, your Personal Data and other information may be transferred to a successor or affiliate as part of that transaction along with other assets.",
    type: "text",
  },
  {
    text: "·Legal Requirements: If required to do so by law or in the good faith belief that such action is necessary to (i) comply with a legal obligation, (ii) protect and defend our rights or property, (iii) act in urgent circumstances to protect the personal safety of Users of the Site or the App, or the public, or (iv) protect against legal liability.",
    type: "text",
  },
  {
    text: "Data Retention",
    type: "title",
  },
  {
    text: "We will keep your Personal Data for as long as reasonably necessary for the purposes described in this Privacy Policy, while we have a legitimate business need to do so, or as required by law (e.g. for tax, legal, accounting or other purposes), whichever is the longer.",
    type: "text",
  },
  {
    text: "If you have elected to receive marketing communications from us, we retain information about your marketing preferences until you opt out of receiving these communications and in accordance with our policies.",
    type: "text",
  },
  {
    text: "To determine the appropriate retention period for your Personal Data, we will consider the amount, nature, and sensitivity of the Personal Data, the potential risk of harm from unauthorized use or disclosure of your Personal Data, the purposes for which we use your Personal Data and whether we can achieve those purposes through other means, and the applicable legal requirements. In some circumstances we may anonymize your Personal Data so that it can no longer be associated with you, in which case it is no longer Personal Data.",
    type: "text",
  },
  {
    text: "Update your Information",
    type: "title",
  },
  {
    text: "If you need to change or correct your Personal Data, or wish to have it deleted from our systems, you may contact us. We will address your request as required by applicable law. You may also update your Personal Data from your user settings.",
    type: "text",
  },
  {
    text: "California Privacy Disclosure",
    type: "title",
  },
  {
    text: "Do Not Track Signals: The Site currently does not respond to “Do Not Track” (“DNT”) signals and operates as described in this Privacy Policy whether or not a DNT signal is received. If we do respond to DNT signals in the future, we will update this Privacy Policy to describe how we do so.",
    type: "text",
  },
  {
    text: "European Union (EU) Users",
    type: "title",
  },
  {
    text: "Scope. This section applies if you are a User in the EU (for these purposes, reference to the EU also includes the European Economic Area countries of Iceland, Liechtenstein and Norway).",
    type: "text",
  },
  {
    text: "Data Controller. Pokadot, Inc. is the data controller for processing Personal Data provided to us through the Services. To find out our contact details, please see the “Contact Us” section below, which also provides the contact details of our representative in the EU for purposes of the General Data Protection Regulation.",
    type: "text",
  },
  {
    text: "Your Rights. Subject to applicable EU law, you have the following rights in relation to your Personal Data:",
    type: "text",
  },
  {
    text: "-Right of access: If you ask us, we will confirm whether we are processing your Personal Data and, if so, provide you with a copy of that Personal Data along with certain other details. If you require additional copies, we may need to charge a reasonable fee.",
    type: "text",
  },
  {
    text: "-Right to rectification: If your Personal Data is inaccurate or incomplete, you are entitled to ask that we correct or complete it. If we shared your Personal Data with others, we will tell them about the correction where possible. If you ask us, and where possible and lawful to do so, we will also tell you with whom we shared your Personal Data so you can contact them directly.",
    type: "text",
  },
  {
    text: "-Right to erasure: You may ask us to delete or remove your Personal Data, such as where you withdraw your consent. If we shared your data with others, we will tell them about the erasure where possible. If you ask us, and where possible and lawful to do so, we will also tell you with whom we shared your Personal Data with so you can contact them directly.",
    type: "text",
  },
  {
    text: "-Right to restrict processing: You may ask us to restrict or ‘block’ the processing of your Personal Data in certain circumstances, such as where you contest the accuracy of the data or object to us processing it (please read below for information on your right to object). We will tell you before we lift any restriction on processing. If we shared your Personal Data with others, we will tell them about the restriction where possible. If you ask us, and where possible and lawful to do so, we will also tell you with whom we shared your Personal Data so you can contact them directly.",
    type: "text",
  },
  {
    text: "-Right to data portability: You have the right to obtain your Personal Data from us that you consented to give us or that was provided to us as necessary in connection with our contract with you. We will give you your Personal Data in a structured, commonly used and machine-readable format. You may reuse it elsewhere.",
    type: "text",
  },
  {
    text: "-Right to object: You may ask us at any time to stop processing your Personal Data, and we will do so:",
    type: "text",
  },
  {
    text: "If we are relying on a legitimate interest to process your Personal Data -- unless we demonstrate compelling legitimate grounds for the processing or If we are processing your Personal Data for direct marketing.",
    type: "text",
  },
  {
    text: "-Right to withdraw consent:If we rely on your consent to process your Personal Data, you have the right to withdraw that consent at any time. Withdrawal of consent will not affect any processing of your data before we received notice that you wished to withdraw consent.",
    type: "text",
  },
  {
    text: "-Right to lodge a complaint with the data protection authority: If you have a concern about our privacy practices, including the way we handled your Personal Data, you can report it to the data protection authority that is authorized to hear those concerns.",
    type: "text",
  },
  {
    text: "Please see the “Contact Us” section below for information on how to contact us to exercise your rights.",
    type: "text",
  },
  {
    text: "Legitimate Interest. “Legitimate interests” means our interests in conducting our business, managing and delivering the best Services to you. This Privacy Policy describes when we process your Personal Data for our legitimate interests, what these interests are and your rights. We will not use your Personal Data for activities where the impact on you overrides our interests, unless we have your consent or those activities are otherwise required or permitted to by law.",
    type: "text",
  },
  {
    text: "Public Posted Information",
    type: "title",
  },
  {
    text: "This Privacy Policy shall not apply to any information you post to the public areas of the Services. Comments posted to public areas may be viewed, accessed, and used by third parties subject to those parties’ privacy practices and policies.",
    type: "text",
  },
  {
    text: "Children",
    type: "title",
  },
  {
    text: "OpenMic does not knowingly collect Personal Data from children under the age of 13. If you have reason to believe that a child under the age of 13 has provided Personal Data to OpenMic through the Services please contact us and we will endeavor to delete that information from our databases.",
    type: "text",
  },
  {
    text: "Links to Other Websites",
    type: "title",
  },
  {
    text: "The Site and the App may contain links to other websites not operated or controlled by us (“Third Party Sites”), including the Social Media Services. The information that you share with Third Party Sites will be governed by the specific privacy policies and terms of service of the Third Party Sites and not by this Privacy Policy. By providing these links we do not imply that we endorse or have reviewed these sites. Please contact those sites directly for information on their privacy practices and policies.",
    type: "text",
  },
  {
    text: "Cookies",
    type: "title",
  },
  {
    text: "The Site uses cookies to operate and administer our Site and the Services, make it easier for you to use the Services during future visits and gather usage data on our Site or App.",
    type: "text",
  },
  {
    text: "What Are Cookies. A “cookie” is a piece of information sent to your browser by a website you visit. By choosing to use our the Site after having been notified of our use of cookies in the ways described in this Privacy Policy, and, in applicable jurisdictions, through notice and unambiguous acknowledgement of your consent, you agree to such use.",
    type: "text",
  },
  {
    text: "Some cookies expire after a certain amount of time, or upon logging out (session cookies), others remain on your computer or terminal device for a longer period (persistent cookies). Our Site uses first party cookies (cookies set directly by OpenMic) as well as third party cookies, as described below. For more details on cookies please visit All About Cookies.",
    type: "text",
  },
  {
    text: "Type of Cookies Used. The Site uses the following technologies:",
    type: "text",
  },
  {
    text: "-Strictly Necessary Cookies: Used to provide Users with the Services available through our Site and to use some of their features, such as the ability to log-in and access to secure areas. These cookies are served by OpenMic and are essential for using and navigating the Site. Without these cookies, basic functions of our Site would not work. Because these cookies are strictly necessary to deliver the Site and the Services, you cannot refuse them.",
    type: "text",
  },
  {
    text: "-Analytics/Performance: Used to better understand the behavior of the Users on our Site and improve our Site accordingly, for example by making sure Users are finding what they need easily. The Site uses Google Analytics, a web analytics service provided by Google Inc. (“Google”). The information collected by Google (including your IP address) will be transmitted to and stored by Google on servers in the United States (Google is certified to the Privacy Shield for data transfers). How long a Google Analytics cookie remains on your computer or device depends on what it is and what it is used for. Some Google Analytics cookies expire at the end of your browser session, whilst others can remain for up to two years. You can prevent your data from being collected by Google Analytics on our Site by downloading and installing the Google Analytics Opt-out Browser Add-on for your current web browser.",
    type: "text",
  },
  {
    text: "Your Choices. On most web browsers, you will find a “help” section on the toolbar. Please refer to this section for information on how to receive a notification when you are receiving a new cookie and how to turn cookies off. Please see the links below for guidance on how to modify your web browser’s settings on the most popular browsers:",
    type: "text",
  },
  {
    text: "-Internet Explorer",
    type: "text",
  },
  {
    text: "-Mozilla Firefox",
    type: "text",
  },
  {
    text: "-Google Chrome",
    type: "text",
  },
  {
    text: "-Apple Safari",
    type: "text",
  },
  {
    text: "Please note that if you limit the ability of websites to set cookies, you may be unable to access certain parts of the Site and you may not be able to benefit from the full functionality of the Site.",
    type: "text",
  },
  {
    text: "If you access the Site on your mobile device, you may not be able to control tracking technologies through the settings.",
    type: "text",
  },
  {
    text: "Third Party Websites and Applications",
    type: "title",
  },
  {
    text: "This Privacy Policy only applies to the Services. The Services may contain links to other websites not operated or controlled by OpenMic (the “Third Party Sites”). We do not own, control or operate such linked sites, and we are not responsible for the privacy policies or practices of such linked sites. Privacy policies and practices for such linked sites may differ from this Privacy Policy and our practices. We encourage you to read the privacy policies of such linked sites before disclosing personal information on Third Party Sites.",
    type: "text",
  },
  {
    text: "Links to Other Websites",
    type: "title",
  },
  {
    text: "This Privacy Policy applies only to the Services. The Services may contain links to other web sites not operated or controlled by OpenMic (the “Third Party Sites”). The policies and procedures we described here do not apply to the Third Party Sites. The links from the Services do not imply that OpenMic endorses or has reviewed the Third Party Sites. We suggest contacting those sites directly for information on their privacy policies.",
    type: "text",
  },
  {
    text: "Security",
    type: "title",
  },
  {
    text: "You use Services at your own risk. OpenMic takes steps to protect the Personal Data provided via the Services from loss, misuse, and unauthorized access, disclosure, alteration, or destruction. However, no Internet or e-mail transmission is ever fully secure or error free. In particular, e-mail sent to or from the Services may not be secure. Therefore, you should take special care in deciding what information you send to us via e-mail. Please keep this in mind when disclosing any Personal Data to OpenMic via the internet. We cannot control the actions of other Users with whom you may choose to share information. Therefore, we cannot, and do not, guarantee that information or content posted by a User on or through the Services will not be viewed by unauthorized persons. We are not responsible for circumvention of any privacy settings or security measures contained on the Services or Social Media Services.",
    type: "text",
  },
  {
    text: "Other Terms and Conditions",
    type: "title",
  },
  {
    text: "Your access to and use of the Services is subject to any additional terms applicable to such Services that may be posted on the Services from time to time, including without limitation, OpenMic’s Terms of Use available at https://openmic.fm/terms.",
    type: "text",
  },
  {
    text: "Changes to the Privacy Policy",
    type: "title",
  },
  {
    text: "The Services and our business may change from time to time. As a result we may change this Privacy Policy at any time and when we do we will post an updated version on this page, unless another type of notice is required by the applicable law. By continuing to use the Site and the App or providing us with information after we have posted an updated Privacy Policy, or notified you if applicable, you consent to the revised Privacy Policy and practices described in it.",
    type: "text",
  },
  {
    text: "International Users",
    type: "title",
  },
  {
    text: "OpenMic is based in the United States. If you are accessing our Services from the European Union or other regions with laws governing data collection and use, please note that your Personal Data will be transmitted to our servers in the United States and the data may be transmitted to our service providers supporting our business operations (described above). The United States may have data protection laws less stringent than or otherwise different from the laws in effect in the country in which you are located. Where we transfer your Personal Data out of the EU we will take steps to ensure that your Personal Data receives an adequate level of protection where it is processed and your rights continue to be protected.",
    type: "text",
  },
  {
    text: "By providing your information to the Services you agree to the transfer of your information to the United States and processing globally in accordance with this Privacy Policy.",
    type: "text",
  },
];

const root = {
  margin: 30,
}

const textStyle = {
  color: "#222225",
  font: "Lato",
  fontSize: 15,
}

const titleStyle = {
  color: "#222225",
  font: "Lato",
  fontSize: 25,
}

class PrivacyPolicyPage extends Component {
  constructor(props) {
    super(props);

    this.renderPrivacyPolicy = this.renderPrivacyPolicy.bind(this);
    this.renderElement = this.renderElement.bind(this);
  }

  renderPrivacyPolicy() {
    return (
      <div>
        {tileData.map(tile => (
          <div>
            {this.renderElement(tile)}
          </div>
        ))}
      </div>
    );
  }

  renderElement(element) {
    if (element.type == "text") {
      return (
        <div>
          <p style={textStyle}>{element.text}</p>
        </div>
      );
    } else if (element.type == "title") {
      return (
        <div>
          <h1 style={titleStyle}>{element.text}</h1>
        </div>
      )
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div style={root}>
        <p style={textStyle}>{"Date of Last Revision: Feb 08, 2019"}</p>
        <h1 style={titleStyle}>Privacy Policy</h1>
        <p style={textStyle}>{"Welcome to Pokadot, Inc. (OpenMic”, “we”, “us” and/or “our”) Privacy Policy. Our services are designed to offer users (collectively, “Users,” “you,” or “your”) the opportunity to easily create and share audio recordings with other Users (“Services”). The Services are provided to you through our website (“Site”) and mobile application (“App”)."}</p>
        <p style={textStyle}>{"This Privacy Policy explains what personal data we collect through the Services, how we use and share that data, and your choices concerning our data practices. This Privacy Policy forms part of our Terms of Use, which are available at: https://openmic.fm/#/terms."}</p>
        <p style={textStyle}>{"By providing us with your personal data when using the Services, you agree to the practices described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not access or use the Services."}</p>
        {this.renderPrivacyPolicy()}
      </div>
    )
  }
}

export default PrivacyPolicyPage;
