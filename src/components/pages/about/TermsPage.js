import React, { Component } from 'react';

const text1 = "By accessing or using the Services in any manner, you agree to abide by these Terms of Service and all other operating rules, policies and procedures that may be published from time to time to the Services by us, each of which is incorporated by reference and each of which may be updated from time to time without notice to you.";
const what1 = "Riptide's mission is to democratize audio by making story telling accessible to everyone. You are free to use Riptide as long as your use of it complies with our rules and general common sense. Certain of the Services may be subject to additional terms and conditions specified by us from time to time to the Services ; your use of such Services is subject to those additional terms and conditions, which are incorporated into these Terms of Service by this reference. We reserve the right to modify or replace any of these Terms of Service, or change, suspend, or discontinue the Services (including without limitation, the availability of any feature, database, or content) at any time by posting a notice through the Services, via e-mail or by another appropriate means of electronic communication. Your use of the Services is subject to the Terms of Service in effect at the time of such use.";
const text1_2 = "We reserve the right to modify or replace any of these Terms of Service, or change, suspend, or discontinue the Services (including without limitation, the availability of any feature, database, or content) at any time by posting a notice through the Services, via e-mail or by another appropriate means of electronic communication. Your use of the Services is subject to the Terms of Service in effect at the time of such use.";
const what1_2 = "As Riptide evolves and comes out with new features, it might be necessary to occasionally change the language contained in the Terms of Service. Usually these changes are minor. If they are bigger changes you should be aware of, we'll be sure to let you know. We may also impose limits on certain features and services or restrict your access to parts or all of Services without notice or liability. We also reserve the right to modify or discontinue, temporarily or permanently, the Services (or any part thereof) with or without notice. You agree that we will not be liable to you or to any third party for any modification, suspension or discontinuance of Services. Arbitration notice and class action waiver: Except for certain types of disputes described in the arbitration section below, you agree that disputes between you and us will be resolved by binding, individual arbitration, and you waive your right to participate in a class action lawsuit or class-wide arbitration.";

const text2 = "You represent and warrant that you are at least 13 years of age. If you are under age 13, you may not use the Services.";
const what2 = "You must be at least 13 to use Riptide. Further, you may not access or use the Services if your access or use of the Services is prohibited or conflicts with any applicable local, state, national or international laws and regulations. You must notify us immediately of any change in your eligibility to use the Services. We may, in our sole discretion, refuse to offer the Services to any person or entity and change these eligibility criteria at any time.";

const text3 = "To use some aspects of the Services, you must register for an account (an 'Account'). Registration data and certain other information about you and your Account are governed by our Privacy Policy. You will not: (i) select or use as a username a name of another person with the intent to impersonate that person, (ii) use as a username a name subject to any rights of a person (including, without limitation, copyrights or trademarks) other than you without appropriate authorization or (iii) use, as a username, a name that is otherwise offensive, vulgar or obscene. You are solely responsible for the activity that occurs on your Account and for keeping your Account password secure. You may never use another person’s user account or registration information for the Services without permission. You must notify us immediately of any breach of security or unauthorized use of your Account. You should never publish, distribute or post login information for your " +
"Account. We will not be liable for any loss or damage arising from your failure to comply with this Section." + " You will have the ability to delete your Account, either by following the instructions on the Services or by sending a request to help@riptide.fm.";
const what3 = "When creating an account on Riptide, you should be considerate to other people who may hear or see your podcast. You're not allowed to impersonate anyone with the intent to deceive, or use branding that is offensive or inappropriate."

const title4 = "Definition";
const text4 = "For purposes of these Terms of Service, the term “Content” includes, any information, audio, text, graphics, photos or other materials uploaded, downloaded or appearing on the Services. “Content” also includes all User Content (as defined below).";
const title4_2 = "User Content";
const text4_2 = "All Content added, created, uploaded, submitted, distributed, or posted to the Services by users (collectively “User Content”), whether publicly posted or privately transmitted, is the sole responsibility of the person who originated such User Content. You represent that all User Content provided by you is in compliance with all applicable laws, rules and regulations, including, but not limited to, copyright laws. You acknowledge that all Content, including User Content, accessed by you using the Services is at your own risk and you will be solely responsible for any damage or loss to you or any other party resulting therefrom. We do not pre-screen content and do not guarantee that any Content you access on or through the Services is or will continue to be accurate.";
const what4_2 = "You're not allowed to use Riptide to infringe on copyrighted content, break any laws, or cause harm to other people. If you do, you'll be held personally and solely responsible.";
const title4_3 = "Notices and Restrictions";
const text4_3 = "The Services may contain Content specifically provided by us, our partners or our users. Such Content is protected by copyrights, trademarks, service marks, patents, trade secrets or other proprietary rights and laws. Except as expressly authorized by us, you agree not to modify, copy, frame, scrape, rent, lease, loan, sell, distribute or create derivative works based on such Content, in whole or in part, except that the foregoing does not apply to your own User Content that you legally upload to the Services. You will abide by and maintain all copyright notices, information, and restrictions contained in any Content accessed through the Services.";
const what4_3 = "Please don't attempt to alter, interfere with, scrape, or sell content that is not your own.";
const title4_4 = "Use License";
const text4_4 = "Subject to these Terms of Service, we grant you a worldwide, non-exclusive, non-sublicensable and non-transferable license to use, copy, distribute and display Content solely for purposes of using the Services. You will not sell, license, rent, or otherwise use any Content for commercial use or in any way that violates any third party right.";
const what4_4 = "Content on Riptide can be consumed, distributed, and shared by other Riptide users. However, users cannot sell each other's content without the content owner's permission.";
const title4_5 = "License Grant";
const text4_5 = "You retain all of your ownership rights in your User Content. Using Riptide never has and never will cause you to lose ownership of your content.";
const what4_5 = "You own your content. By using Riptide, you are not giving up any rights to use your content in any way or any place you want. Riptide prides itself on empowering creators, and we have no intention to limit your rights in your content in any way."
const text4_6 = "By submitting User Content through the Services, you hereby grant us a non-exclusive license to use, edit, modify, aggregate, reproduce, distribute, display, and perform the User Content in connection with the operation of the Services, the promotion, advertising or marketing of the Services, and the operation of Riptide’s (and its successors’ and affiliates’) business. This license is worldwide, royalty-free, sublicensable and transferable.";
const what4_6 = "In order to use Riptide, you are giving us permission to use, host, and distribute the content you create. For instance, this license allow us to syndicate your content to other platforms, so that your audience can hear your podcast anywhere they choose. We believe strongly in creators’ rights, and in no way does this license take away the ownership rights you have in your content.";
const text4_7 = "You agree that this license includes, without limitation, the right for Riptide to provide, promote, and improve the Services. We may also use this license to make User Content available to other companies, organizations or individuals who partner with Riptide for the syndication, broadcast, distribution or publication of such User Content on other media and services.";
const what4_7 = "One of the best parts of Riptide is the ability to create in one place and optionally let us handle the hassle of distributing your podcast everywhere. This language allows us to distribute your content on your behalf, so that you can focus on creating and leave the technical headache of podcast distribution to us. You are also welcome to distribute your podcast to other platforms manually if you prefer.";
const text4_8 = "Such license will terminate within a commercially reasonable time upon the termination of your account on Riptide as it applies to User Content stored in the Services or otherwise controlled by Riptide at the time of termination.";
const what4_8 = "If you leave Riptide (which you are free to do at any time) and ask us to delete your content, we will do so promptly. Note that content that is distributed to third parties may be out of our control. In those cases, you may have to reach out to other companies (such as audio playing apps) to ask them to remove your content directly.";
const text4_9 = "You acknowledge and agree that any questions, comments, suggestions, ideas, feedback or other information about the Services (“Submissions”), provided by you to us are non-confidential and we will be entitled to the unrestricted use and dissemination of these Submissions for any purpose, commercial or otherwise, without acknowledgment or compensation to you.";
const what4_9 = "We love when our users give feedback or propose ideas. We encourage you to do so! We just ask that you be aware that while we may follow through on your proposals, we unfortunately can't pay you for them.";
const text4_10 = "For clarity, these license grants do not affect your other ownership or license rights in your User Content, including the right to grant additional licenses to your User Content, unless otherwise agreed in writing. You represent and warrant that you have all rights to grant such licenses to us without infringement or violation of any third party rights, including without limitation, any privacy rights, publicity rights, copyrights, trademarks, contract rights, or any other intellectual property or proprietary rights.";
const what4_10 = "YOU own your own content. However, you also promise us that your content is actually yours, and that by putting it on Riptide, you're not violating anyone else's rights.";
const title4_11 = "Availability of Content";
const text4_11 = "We do not guarantee that any Content will be made available through the Services. You acknowledge that we may establish general practices and limits concerning use of the Services, including without limitation the maximum period of time that Content will be retained by the Services and the maximum storage space that will be allotted on our servers on your behalf. You agree that we have no responsibility or liability for the deletion or failure to store any Content maintained or uploaded by the Services. We reserve the right to, but do not have any obligation to, (i) remove any Content in our sole discretion, at any time, without notice to you and for any reason (including, but not limited to, upon receipt of claims or allegations from third parties or authorities relating to such Content or if we are concerned that you may have violated these Terms of Service), or for no reason at all and (ii) to remove or block any Content from the Services.";
const what4_11 = "We have the right to remove content from our platform for various reasons, including what we believe are violations of these terms. We encourage you to back up all of your audio, just in case.";

const text5 = "As a condition of use, you promise not to use the Services for any purpose that is prohibited by these Terms of Service. You are responsible for all of your activity in connection with the Services.";
const text5_2 = "You will comply with all laws, rules and regulations (for example, federal, state and local) applicable to your use of the Services and your User Content, including but not limited to, copyright laws, and will not further or promote any criminal activity or enterprise or provide instructional information about illegal activities.";
const what5_2 = "By using Riptide, you promise to follow these rules and any law that might govern you.";
const text5_3 = "You will not (and will not permit any third party to) either (a) take any action or (b) upload, post, submit or otherwise distribute or facilitate distribution of any Content through the Services, including without limitation any User Content, that: infringes any patent, trademark, trade secret, copyright, right of publicity or other right of any other person or entity or violates any law or contractual duty; you know is false, misleading, untruthful or inaccurate; is unlawful, threatening, abusive, harassing, defamatory, libelous, slanderous, deceptive, fraudulent, invasive of another's privacy, tortious, obscene, vulgar, pornographic, offensive, profane, contains or depicts nudity, contains or depicts sexual activity, or is otherwise inappropriate as determined by us in our sole discretion; constitutes unauthorized or unsolicited advertising, junk or bulk e-mail (“spamming”); contains software viruses or any other computer codes, files, or programs that are designed or intended to disrupt, damage, limit or interfere with the proper function of any software, hardware, or telecommunications equipment or to damage or obtain unauthorized access to any system, data, password or other information of ours or of any third party; impersonates any person or entity, including any of our employees or representatives; includes anyone’s identification documents or sensitive financial information; poses or creates a privacy or security risk to any person; or in our sole judgment, is objectionable or which restricts or inhibits any other person from using or enjoying the Services, or which may expose us or our users to any harm or liability of any type.";
const what5_3 = "There are various types of content that are strictly forbidden on Riptide, like content that is stolen, dangerous, or illegal. Use common sense and you'll be fine!";
const text5_4 = "You will not: (i) take any action that imposes or may impose (as determined by us in our sole discretion) an unreasonable or disproportionately large load on our (or our third party providers’) infrastructure; (ii) interfere or attempt to interfere with the proper working of the Services or any activities conducted on the Services; (iii) bypass, circumvent or attempt to bypass or circumvent any measures we may use to prevent or restrict access to the Services (or other accounts, computer systems or networks connected to the Services); (iv) run any form of auto-responder or “spam” on the Services; (v) use manual or automated software, devices, or other processes to “crawl” or “spider” any page of Riptide’s websites; (vi) harvest or scrape any Content or contact information from the Services; (vii) solicit personal information from anyone under the age of 18; or (viii) otherwise take any action in violation of our guidelines and policies.";
const text5_5 = "You will not (directly or indirectly): (i) decipher, decompile, disassemble, reverse engineer or otherwise attempt to derive any source code or underlying ideas or algorithms of any part of the Services (including without limitation any application), except to the limited extent applicable laws specifically prohibit such restriction, (ii) modify, translate, or otherwise create derivative works of any part of the Services, (iii) engage in or use any data mining, robots, scraping, or similar data gathering or extraction methods, or (iv) copy, rent, lease, distribute, or otherwise transfer any of the rights that you receive hereunder.";
const what5_5 = "Please don't intentionally overload our servers, attempt to bypass our security measures, or generally do anything intentionally malicious on Riptide.";
const text5_6 = "We reserve the right to take appropriate legal action against anyone who, in our sole discretion, violate this Section, including without limitation, removing the offending content from the Services, suspending or terminating the account of such violators and reporting you to the law enforcement authorities.";
const text5_7 = "We also reserve the right to access, read, preserve, and disclose any information as we reasonably believe is necessary to (i) satisfy any applicable law, regulation, legal process or governmental request, (ii) enforce these Terms of Service, including investigation of potential violations hereof, (iii) detect, prevent, or otherwise address fraud, security or technical issues, (iv) respond to user support requests, or (v) protect the rights, property or safety of us, our users and the public.";

const text6 = "The Riptide name and logos are trademarks and service or brand identifier’s marks of Riptide (collectively the “Riptide Trademarks”). Other company, product, and service names and logos used and displayed via the Services may be trademarks or service marks of their respective owners who may or may not endorse or be affiliated with or connected to us.";
const what6 = "You agree not to use Riptide's brand, including our logo, for any purpose without our permission. Doing so may be an infringement of our intellectual property.";
const text6_2 = "Nothing in this Terms of Service or the Services should be construed as granting, by implication, estoppel, or otherwise, any license or right to use any of Riptide Trademarks displayed on the Services, without our prior written permission in each instance. All goodwill generated from the use of Riptide Trademarks will inure to our exclusive benefit.";

const text7 = "The Services may permit you to link to other websites, services or resources on the Internet, and other websites, services or resources may contain links to the Services. When you access third party resources on the Internet, you do so at your own risk. These other resources are not under our control, and you acknowledge that we are not responsible or liable for the content, functions, accuracy, legality, appropriateness or any other aspect of such websites or resources. The inclusion of any such link does not imply our endorsement or any association between us and their operators.";
const what7 = "We do not review or monitor external links put in Riptide content. Please be careful when clicking any link to the outside world, and please be mindful of which links you add to your own content.";
const text7_2 = "You further acknowledge and agree that we will not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such website or resource.";

const text8 = "The Services include certain services that are available via a mobile device, including (i) the ability to upload Content via a mobile device, (ii) the ability to browse the Services from a mobile device and (iii) the ability to access certain features through an application downloaded and installed on a mobile device (collectively, the “Mobile Services”). By using the Mobile Services, you agree that we may communicate with you regarding Company and other entities by SMS, MMS, text message or other electronic means to your mobile device and that certain information about your usage of the Mobile Services may be communicated to us.";
const what8 = "Because you have an Riptide account, we can contact you via text if necessary.";
const text8_2 = "Riptide does not charge a fee to use the Services, but any text messages sent and/or received using the Services are subject to standard text messaging rates. Additionally, text messages sent and/or received count towards a monthly quota as any other messages do. You acknowledge that, whether you are sending or receiving text messages using the Services, standard text messaging rates may apply. In the event you change or deactivate your mobile telephone number, you agree to promptly update your Company account information to ensure that your messages are not sent to the person that acquires your old number.";

const text9 = "If you are accessing the Services via an Riptide mobile application (an “Application”) on a device provided by Apple, Inc. ('Apple') or an Application obtained through the Apple App Store, the following will apply:";
const text9_2 = "Both you and Riptide acknowledge that these Terms of Service are concluded between you and Riptide only, and not with Apple, and that Apple is not responsible for the Application or the Content;";
const text9_3 = "The Application is licensed to you on a limited, non-exclusive, non-transferrable, non-sublicensable basis, solely to be used in connection with the Services for your private, personal, non-commercial use, subject to all the terms and conditions of these Terms of Service as they are applicable to the Services; You will only use the Application in connection with an Apple device that you own or control;";
const text9_4 = "You acknowledge and agree that Apple has no obligation whatsoever to furnish any maintenance and support services with respect to the Application; Apple is not responsible for any product warranties, whether express or implied by law.";
const what9_4 = "Riptide is not an Apple product. Note that if you're using Riptide on your Apple device, your relationship to the app and to these terms is with us, not with Apple.";
const text9_5 = "In the event of any failure of the Application to conform to any applicable warranty, including those implied by law, you may notify Apple of such failure; upon notification, Apple's sole warranty obligation to you will be to refund to you the purchase price, if any, of the Application; and, to the maximum extent permitted by applicable law, Apple will have no other warranty obligation whatsoever with respect to the Application, or any other claims, losses, liabilities, damages, costs or expenses attributable to any failure to conform to any warranty, which will be our sole responsibility, to the extent it cannot be disclaimed under applicable law; You acknowledge and agree that Riptide, and not Apple, is responsible for addressing any claims you or any third party may have in relation to the Application, including, but not limited to: (i) product liability claims; (ii) any claim that the Application fails to conform to any applicable legal or regulatory requirement; and (iii) claims arising under consumer protection or similar legislation; You acknowledge and agree that, in the event of any third party claim that the Application or your possession and use of the Application infringes that third party's intellectual property rights, Riptide, and not Apple, will be responsible for the investigation, defense, settlement and discharge of any such infringement claim; You represent and warrant that you are not located in a country subject to a U.S. Government embargo, or that has been designated by the U.S. Government as a 'terrorist supporting' country, and that you are not listed on any U.S. Government list of prohibited or restricted parties; Both you and Riptide acknowledge and agree that, in your use of the Application, you will comply with any applicable third party terms of agreement which may affect or be affected by such use; and Both you and Riptide acknowledge and agree that Apple and Apple's subsidiaries are third party beneficiaries of these Terms of Service, and that upon your acceptance of these Terms of Service, Apple will have the right (and will be deemed to have accepted the right) to enforce these Terms of Service against you as the third party beneficiary hereof.";

const text10 = "You may enable or log in to the Services via various online third party services, such as social media and social networking services like Facebook or Twitter (the “Social Networking Services”). By logging in or directly integrating these Social Networking Services into the Service, we make your online experiences richer and more personalized. To take advantage of this feature and capabilities, we may ask you to authenticate, register for or log into Social Networking Services on the websites of their respective providers. As part of such integration, the Social Networking Services will provide us with access to certain information that you have provided to such Social Networking Services, and we will use, store and disclose such information in accordance with our Privacy Policy.";
const what10 = "If you choose to link your other social accounts to Riptide through some of our features, you recognize that some data about you is shared between us and these third parties. Always be careful about what personal information you share on any platform, including Riptide. Your privacy is of paramount importance to us, and we will always strive to respect that privacy.";
const text10_2 = "For more information about the implications of activating these Social Networking Services and our use, storage and disclosure of information related to you and your use of such services within Riptide (including your friend lists and the like), please see our Privacy Policy. However, please remember that the manner in which Social Networking Services use, store and disclose your information is governed solely by the policies of such third parties, and we will have no liability or responsibility for the privacy practices or other actions of any third party site or service that may be enabled on the Services.";
const text10_3 = "In addition, we are not responsible for the accuracy, availability or reliability of any information, content, goods, data, opinions, advice or statements made available in connection with Social Networking Services. As such, we are not liable for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such Social Networking Services. We enable these features merely as a convenience and the integration or inclusion of such features does not imply an endorsement or recommendation.";

const text11 = "We may terminate your access to all or any part of the Services at any time, with or without cause, with or without notice, which may result in the forfeiture and destruction of all information associated with your membership.";
const what11 = "Common sense and generally being a nice person means you can use Riptide all you wish! But if we do ever find reason to terminate your account, we have the ability to do so without a guarantee that we will notify you.";
const text11_2 = "You agree that we will not be liable to you or any third party for any termination of your access to the Services.";
const text11_3 = "If you wish to terminate your Account, you may do so by contacting us at help@riptide.fm.";
const text11_4 = "All provisions of these Terms of Service which by their nature should survive termination will survive termination, including, without limitation, licenses of User Content not otherwise terminated in the manner described above, ownership provisions, warranty disclaimers, indemnity and limitations of liability.";

const text12 = "We have no special relationship with or fiduciary duty to you.";
const text12_2 = "You acknowledge that we have no duty to take any action regarding: which users gain access to the Services; what Content you access via the Services; or how you may interpret or use the Content.";
const text12_3 = "You release us from all liability for you having acquired or not acquired Content through the Services. We make no representations concerning any Content contained in or accessed through the Services, and we will not be responsible or liable for the accuracy, copyright compliance, or legality of material or Content contained in or accessed through the Services.";
const text12_4 = "The Services and Content are provided “as is”, “as available” and without warranty of any kind, express, statutory or implied, including, but not limited to, the implied warranties of title, non-infringement, merchantability and fitness for a particular purpose, and any warranties implied by any course of performance or usage of trade, all of which are expressly disclaimed. We, and our directors, employees, agents, suppliers, partners and content providers do not warrant that: (I) the Services will be secure or available at any particular time or location; (II) any defects or errors will be corrected; (III) any content or software available through the Services is free of viruses or other harmful components; or (IV) the results of using the Services will meet your requirements. Your use of the services is solely at your own risk. The foregoing disclaimers of warranties in this section of the Terms are not enforceable with respect to users of the Service from New Jersey, to the extent that such disclaimer is unreasonable.";
const what12_4 = "We do our best to build the best darn podcasting platform in the world. But we can't make any guarantees. You agree we won't be liable if it ever doesn't work as intended, or if you come across content or users that you're not happy with.";

const text13 = "You will defend, indemnify, and hold harmless us, our affiliates and each of our and their respective employees, contractors, directors, suppliers and representatives from all liabilities, claims, and expenses, including reasonable attorneys’ fees, that arise from or relate to your use or misuse of, or access to, the Services, Content, or otherwise from your User Content, violation of these Terms of Service or any other terms and conditions provided by use to you that are applicable to your use of specific Services (such as the Monetization Terms of Service), or infringement by you, or any third party using your Account or identity in the Services, of any intellectual property or other right of any person or entity.";
const text13_2 = "We reserve the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will assist and cooperate with us in asserting any available defenses. Any obligation to indemnify any indemnified party for any loss, liability or expense arising from any negligent, grossly negligent, reckless, willful, fraudulent or intentional conduct committed by any indemnified party is not enforceable against any user of the service from New Jersey.";
const what13_2 = "If we ever get sued and it's because you violated these terms, some rule, or a law, or created content that caused someone else to sue us, you agree to reimburse us for the consequences of your misdeeds or that content.";

const text14 = "In no event will we, nor our directors, employees, agents, partners, suppliers or content providers, be liable under contract, tort, strict liability, negligence or any other legal or equitable theory with respect to the services (I) for any lost profits, data loss, use or inability to use the services, cost of procurement of substitute goods or services, unauthorized access to or alteration of your transmissions or data, statements or conduct of any third party on the services, or special, indirect, incidental, punitive, compensatory or consequential damages of any kind whatsoever (however arising), even if we have been advised of the possibility of such damages, (II) for any bugs, viruses, Trojan horses, or the like (regardless of the source of origination), or (III) for any direct damages in excess of (in the aggregate) the greater of (A) fees paid to us for the particular Services during the immediately previous three (3) month period or (B) $500.00. Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for incidental or consequential damages. Accordingly, some of the above limitations set forth above may not apply to you. If you are dissatisfied with any portion of these services of with these Terms of Service, your sole and exclusive remedy is to discontinue use of the services.";
const what14 = "We have no intention of this ever happening. But, if we ever do something that somehow causes you to suffer a financial loss, you agree to a limit to how much we may need to reimburse you.";
const text14_2 = "Any limitation of our liability with respect to liability arising from our negligence, gross negligence or intentional misconduct is not enforceable with respect to users of the Service from New Jersey.";

const text15 = "We strongly encourage you to review this Arbitration Clause and Class Action Waiver, as it affects your legal rights.";
const what15 = "If you and Riptide ever have a disagreement (and we hope that never happens!), instead of facing the lengthy and expensive process of going to court, we agree to use the alternative dispute resolution process described here.";
const title15 = "Arbitration";
const text15_2 = "You agree that all disputes between you and us (whether or not such dispute involves a third party) with regard to your relationship with us, including without limitation disputes related to these Terms of Service, your user of the Services, and/or your rights of privacy and/or publicity, will be resolved by binding arbitration under the American Arbitration Association’s Rules for Arbitration under the American Arbitration Association’s Rules for Arbitration of Consumer-Related Disputes and you and we hereby expressly waive trial by juryand judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof. The arbitration proceedings will be conducted before one (1) neutral arbitrator selected by the American Arbitration Association. The place of arbitration will be New York, New York. Either party may apply to the arbitrator seeking injunctive relief until the arbitration award is rendered or the controversy is otherwise resolved. Either party also may, without waiving any remedy under these Terms of service, seek from any court having jurisdiction any interim or provisional relief that is necessary to protect the rights or property of that party, pending the establishment of the ARBITRATOR (or pending the ARBITRATOR’S determination of the merits of the controversy). As an alternative, you may bring your claim in your local “small claims” court, if permitted by that small claims court's rules and if within such court’s jurisdiction, unless such action is transferred, removed or appealed to a different court. You may bring claims only on your own behalf. Neither you nor we will participate in a class action or class-wide arbitration for any claims covered by this agreement to arbitrate. You are giving up your right to participate as a class representative or class member on any class claim you may have against us including any right to class arbitration or any consolidation of individual arbitrations. You also agree not to participate in claims brought in a private attorney general or representative capacity, or consolidated claims involving another person's account, if we are a party to the proceeding. This dispute resolution provision will be governed by the Federal Arbitration Act and not by any state law concerning arbitration. In the event the American Arbitration Association is unwilling or unable to set a hearing date within one hundred and sixty (160) days of filing the case, then either we or you can elect to have the arbitration administered instead by the Judicial Arbitration and Mediation Services. Judgment on the award rendered by the arbitrator may be entered in any court having competent jurisdiction. Any provision of applicable law notwithstanding, the arbitrator will not have authority to award damages, remedies or awards that conflict with these Terms of Service. You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of, related to or connected with the use of the Services or these Terms of Service must be filed within one (1) year after such claim of action arose or be forever banned.";
const title15_3 = "Severability";
const text15_4 = "If the prohibition against class actions and other claims brought on behalf of third parties contained above is found to be unenforceable, then all of the preceding language in this Arbitration section will be null and void. This arbitration agreement will survive the termination of your relationship with us.";

const text16 = "These Terms of Service will be governed by and construed in accordance with the laws of the State of New York, including its conflicts of law rules, and the United States of America. You agree that any dispute arising from or relating to the subject matter of these Terms of Service or otherwise not subject to arbitration will be governed by the exclusive jurisdiction and venue of the state and Federal courts of San Francisco, California.";
const what16 = "We're based in SF, so that's the law that governs this agreement."

const title17 = "Entire Agreement and Severability";
const text17 = "These Terms of Service are the entire agreement between you and us with respect to the Services and supersede all prior or contemporaneous communications and proposals (whether oral, written or electronic) between you and us with respect to the Services. If any provision of these Terms of Service is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms of Service will otherwise remain in full force and effect and enforceable. The failure of either party to exercise in any respect any right provided for herein will not be deemed a waiver of any further rights hereunder";
const what17 = "These are our terms, our whole terms, and nothing but our terms.";
const title17_2 = "Force Majeure";
const text17_2 = "We will not be liable for any failure to perform our obligations hereunder where such failure results from any cause beyond our reasonable control, including, without limitation, mechanical, electronic or communications failure or degradation.";
const what17_2 = "You agree not to hold us responsible if we can't fulfill part of this agreement because of events that are totally out of our control, like government intervention or an alien invasion.";
const title17_3 = "Assignment";
const text17_3 = "These Terms of Service are personal to you, and are not assignable, transferable or sublicensable by you except with our prior written consent. We may assign, transfer or delegate any of our rights and obligations hereunder without consent.";
const what17_3 = "This agreement is between you and Riptide (or potentially between you and whoever might own Riptide in the future if we ever become acquired by another company down the line).";
const title17_4 = "Agency";
const text17_4 = "No agency, partnership, joint venture, or employment relationship is created as a result of these Terms of Service and neither party has any authority of any kind to bind the other in any respect.";
const what17_4 = "This agreement between you and Riptide is not an employment or contracting agreement. It simply governs your usage of our platform.";
const title17_5 = "Notices";
const text17_5 = "Unless otherwise specified in these Term of Service, all notices under these Terms of Service will be in writing and will be deemed to have been duly given when received, if personally delivered or sent by certified or registered mail, return receipt requested; when receipt is electronically confirmed, if transmitted by facsimile or e-mail; or the day after it is sent, if sent for next day delivery by recognized overnight delivery service. Electronic notices should be sent to help@riptide.fm.";
const what17_5 = "Email us at help@riptide.fm if you need to contact us. Most of our contact with you will also be through email.";
const title17_6 = "No Waiver";
const text17_6 = "Our failure to enforce any part of these Terms of Service will not constitute a waiver of our right to later enforce that or any other part of these Terms of Service. Waiver of compliance in any particular instance does not mean that we will waive compliance in the future. In order for any waiver of compliance with these Terms of Service to be binding, we must provide you with written notice of such waiver through one of our authorized representatives.";
const what17_6 = "If you and Riptide ever agree to some kind of exception to these terms, it must be agreed to in writing.";
const title17_7 = "Headings";
const text17_7 = "The section and paragraph headings in these Terms of Service are for convenience only and will not affect their interpretation.";

const tileData = [
    {
      title: 'Acceptance of Terms of Service',
      texts: [
        {
          text: text1,
          type: "text",
        },
        {
          text: what1,
          type: "what",
        },
        {
          text: text1_2,
          type: "text",
        },
        {
          text: what1_2,
          type: "what",
        },
      ]
    },
    {
      title: 'Eligibility',
      texts: [
        {
          text: text2,
          type: "text",
        },
        {
          text: what2,
          type: "what",
        },
      ],
    },
    {
      title: 'Registration',
      texts: [
        {
          text: text3,
          type: "text",
        },
        {
          text: what3,
          type: "what",
        },
      ],
    },
    {
      title: 'Content',
      texts: [
        {
          text: title4,
          type: "title",
        },
        {
          text: text4,
          type: "text",
        },
        {
          text: title4_2,
          type: "title",
        },
        {
          text: text4_2,
          type: "text",
        },
        {
          text: what4_2,
          type: "what",
        },
        {
          text: title4_3,
          type: "title",
        },
        {
          text: text4_3,
          type: "text",
        },
        {
          text: what4_3,
          type: "what",
        },
        {
          text: title4_4,
          type: "title",
        },
        {
          text: text4_4,
          type: "text",
        },
        {
          text: what4_4,
          type: "what",
        },
        {
          text: title4_5,
          type: "title",
        },
        {
          text: text4_5,
          type: "text",
        },
        {
          text: what4_5,
          type: "what",
        },
        {
          text: text4_6,
          type: "text",
        },
        {
          text: what4_6,
          type: "what",
        },
        {
          text: text4_7,
          type: "text",
        },
        {
          text: what4_7,
          type: "what",
        },
        {
          text: text4_8,
          type: "text",
        },
        {
          text: what4_8,
          type: "what",
        },
        {
          text: text4_9,
          type: "text",
        },
        {
          text: what4_9,
          type: "what",
        },
        {
          text: text4_10,
          type: "text",
        },
        {
          text: what4_10,
          type: "what",
        },
        {
          text: title4_11,
          type: "title",
        },
        {
          text: text4_11,
          type: "text",
        },
        {
          text: what4_11,
          type: "what",
        },
      ]
    },
    {
      title: 'Rules of Conduct',
      texts: [
        {
          text: text5,
          type: "text",
        },
        {
          text: text5_2,
          type: "text",
        },
        {
          text: what5_2,
          type: "what",
        },
        {
          text: text5_3,
          type: "text",
        },
        {
          text: what5_3,
          type: "what",
        },
        {
          text: text5_4,
          type: "text",
        },
        {
          text: text5_5,
          type: "text",
        },
        {
          text: what5_5,
          type: "what",
        },
        {
          text: text5_6,
          type: "text",
        },
        {
          text: text5_7,
          type: "text",
        },
      ],
    },
    {
      title: 'Trademarks',
      texts: [
        {
          text: text6,
          type: "text",
        },
        {
          text: what6,
          type: "what",
        },
        {
          text: text6_2,
          type: "text",
        },
      ],
    },
    {
      title: 'Third Party Services',
      texts: [
        {
          text: text7,
          type: "text",
        },
        {
          text: what7,
          type: "what",
        },
        {
          text: text7_2,
          type: "text",
        },
      ],
    },
    {
      title: 'Mobile Services',
      texts: [
        {
          text: text8,
          type: "text",
        },
        {
          text: what8,
          type: "what",
        },
        {
          text: text8_2,
          type: "text",
        },
      ],
    },
    {
      title: 'Apple Devices and Application Terms',
      texts: [
        {
          text: text9,
          type: "text",
        },
        {
          text: text9_2,
          type: "text",
        },
        {
          text: text9_3,
          type: "text",
        },
        {
          text: text9_4,
          type: "text",
        },
        {
          text: what9_4,
          type: "what",
        },
        {
          text: text9_5,
          type: "text",
        },
      ],
    },
    {
      title: 'Social Networking Services',
      texts: [
        {
          text: text10,
          type: "text",
        },
        {
          text: what10,
          type: "what",
        },
        {
          text: text10_2,
          type: "text",
        },
        {
          text: text10_3,
          type: "text",
        },
      ],
    },
    {
      title: 'Termination',
      texts: [
        {
          text: text11,
          type: "text",
        },
        {
          text: what11,
          type: "what",
        },
        {
          text: text11_2,
          type: "text",
        },
        {
          text: text11_3,
          type: "text",
        },
        {
          text: text11_4,
          type: "text",
        },
      ],
    },
    {
      title: 'Warranty Disclaimer',
      texts: [
        {
          text: text12,
          type: "text",
        },
        {
          text: text12_2,
          type: "text",
        },
        {
          text: text12_3,
          type: "text",
        },
        {
          text: text12_4,
          type: "text",
        },
        {
          text: what12_4,
          type: "what",
        },
      ],
    },
    {
      title: 'Indemnification',
      texts: [
        {
          text: text13,
          type: "text",
        },
        {
          text: text13_2,
          type: "text",
        },
        {
          text: what13_2,
          type: "what",
        },
      ],
    },
    {
      title: 'Limitation of Liability',
      texts: [
        {
          text: text14,
          type: "text",
        },
        {
          text: what14,
          type: "what",
        },
        {
          text: text14_2,
          type: "text",
        },
      ],
    },
    {
      title: 'Arbitration',
      texts: [
        {
          text: text15,
          type: "text",
        },
        {
          text: what15,
          type: "what",
        },
        {
          text: title15,
          type: "title",
        },
        {
          text: text15_2,
          type: "text",
        },
        {
          text: title15_3,
          type: "title",
        },
        {
          text: text15_4,
          type: "text",
        },
      ],
    },
    {
      title: 'Governing Law and Jurisdiction',
      texts: [
        {
          text: text16,
          type: "text",
        },
        {
          text: what16,
          type: "what",
        },
      ],
    },
    {
      title: 'Miscellaneous',
      texts: [
        {
          text: title17,
          type: "title",
        },
        {
          text: text17,
          type: "text",
        },
        {
          text: what17,
          type: "what",
        },
        {
          text: title17_2,
          type: "title",
        },
        {
          text: text17_2,
          type: "text",
        },
        {
          text: what17_2,
          type: "what",
        },
        {
          text: title17_3,
          type: "title",
        },
        {
          text: text17_3,
          type: "text",
        },
        {
          text: what17_3,
          type: "what",
        },
        {
          text: title17_4,
          type: "title",
        },
        {
          text: text17_4,
          type: "text",
        },
        {
          text: what17_4,
          type: "what",
        },
        {
          text: title17_5,
          type: "title",
        },
        {
          text: text17_5,
          type: "text",
        },
        {
          text: what17_5,
          type: "what",
        },
        {
          text: title17_6,
          type: "title",
        },
        {
          text: text17_6,
          type: "text",
        },
        {
          text: what17_6,
          type: "what",
        },
        {
          text: title17_7,
          type: "title",
        },
        {
          text: text17_7,
          type: "text",
        },
      ],
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

 const whatDoesItMeanStyle = {
   color: "#D14D85",
   font: "Lato",
   fontSize: 18,
 }

 const whatStyle = {
   color: "#D14D85",
   font: "Lato",
   fontSize: 15,
 }

class TermsPage extends Component {
  constructor(props) {
    super(props);

    this.renderTerms = this.renderTerms.bind(this);
    this.renderElement = this.renderElement.bind(this);
  }

  renderTerms() {
    return (
      <div>
        {tileData.map((tile, index) => (
          <div>
            <h1 style={titleStyle}>{(index + 1) + ". " + tile.title}</h1>
            {tile.texts.map(t => (
              <div>
                {this.renderElement(t)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  renderElement(element) {
    if (element.type === "text") {
      return (
        <div>
          <p style={textStyle}>{element.text}</p>
        </div>
      );
    } else if (element.type === "title") {
      return (
        <div>
          <h1 style={titleStyle}>{element.text}</h1>
        </div>
      )
    } else if (element.type === "what") {
      return (
        <div>
          <p style={whatDoesItMeanStyle}>{"What it means:"}</p>
          <p style={whatStyle}>{element.text}</p>
        </div>
      )
    }
  }

  render() {    
		return (
      <div style={root}>
        <p style={textStyle}>{"Date of Last Revision: Feb 08, 2019"}</p>
        <h1 style={titleStyle}>Terms</h1>
        <p style={textStyle}>{"The products and services are provided by Pokadot, Inc. (“Riptide”, “us”, “we” or “our”). Please carefully read these Terms of Service and our Privacy Policy (collectively, the “Terms of Service”). The Terms of Service govern your access to and use of Riptide’s services, including Riptide’s websites, SMS, APIs, email notifications, applications, buttons, widgets, ads and other services (collectively, the “Services”)."}</p>
        <p style={textStyle}>{"The 'What It Means' comments below in bold and purple are intended to clarify and explain these terms. They are not legally binding."}</p>
        {this.renderTerms()}
      </div>
    )
  }
}

export default TermsPage;
