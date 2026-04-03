---
slug: networking-nat-firewalls-isps
title: 'Failing to Connect to My Own Server: A Story of NAT, IPv6, and Carrier Firewalls'
authors: [arjun]
tags: [networking, nat, firewall, isp]
---

# **Failing to Connect to My Own Server: A Story of NAT, IPv6, and Carrier Firewalls**

## **Introduction**

"Just how does a computer communicate with another computer?" a seventh-grade me asked myself. It seemed almost like magic\! How does it happen that writing a message on my Yahoo Messenger gets delivered to a totally different computer?

Fast forward a few years. Enter uTorrent. I felt like I was in a wonderland. I read a bit about seeding and peering, but how did that actually work? I still didn't have an answer, but that question remained an itch in my stomach, growing bigger every day.

Fast forward a few more years, and I was introduced to AJAX and XMLHttpRequest. Okay, so you are telling me that a program can be written so that my computer will send a letter to another computer using the telephone line, and it will actually be delivered? That can't be real\! How does it work?\! I had to know.

## **Problem Statement**

Okay, so here I am a decade later, and I still don't know how to answer that question. But that thought stays with me. I always used to think about how computers actually communicate with each other.

Let's start small. Let's make a server that listens to a port waiting for a "request," and it returns a message back to wherever the request came from. Cool, simple.

But wait, the real challenge is that I must have the server running on my computer on my local network, and I should be able to use my phone on mobile data to knock at my router, asking for the message to be delivered to my laptop. Simple, right? Let's try it...

* Set up the server.  
* I ping from the terminal.  
* It works\! Voila it works, I am a genius.  
* I open my phone, turn off the Wi-Fi, turn on mobile data, and ping the IP of my laptop...

Fails. **"Site failed to respond."**

WTF??

What's wrong??

## ---

**Problem 1: Global IP Addresses, Ports, and the NAT**

### **Understanding the Need for a Global IP Address**

Hmm... it seems like every computer has a local IP that is bounded by the router and whatever is connected to it. It seems like every router is assigned a global IP address. Think of it like a postal code, an address, and a flat number, but just in numbers.

And then, every router internally assigns a new number that represents the mapping of devices and their addresses inside that network.

For instance:

* **Global address of router** \= 12232  
* **Internal address of phone** \= 1  
* **Internal address of laptop** \= 2

Now, if every device just has an internal address, how does an external sender know which device a message needs to be delivered to? Of course, a device outside of the local network doesn't know what IP my router has assigned to my phone or laptop. What's happening here???

*Image Credit: Gemini visualization*

### **The NAT Table**

What…? The NAT meaning Network Address Translation. Oh yeah I know this, this is what always gave me a problem when trying to play Call of Duty Black Ops 2 multiplayer in my childhood. Yeah yeah, so what does this do exactly?

### **An Example: Hotel California**

Imagine the whole network under your router is like a whole ass hotel building, and the router is the security guard, receptionist, and lobby boy all rolled into one.

Let's say you decide to visit https://google.com. You want that webpage displayed on your device, so your phone is like, "Ah, let me order a webpage for myself to see." It hits up the receptionist (the router) and says, "Hey router, I am room 1, get me this webpage\!"

The router is like, "Okay, working on it." While your phone waits for the page to load, the router makes an entry in a ledger using a random number between 1 and 65536\. This is called a "port" number. As it forwards your request to Google, it makes a note: "If any response comes back on this port, I will return it to address 1, which is the local IP associated with this port."

When Google returns the response on local port 543 (for instance), the router knows exactly what to do. It checks its NAT table and forwards the webpage straight to the correct room that called it in.

### **Conflict of Interest, Parallelization, and Identity Management**

Okay, but what happens when 2 devices want to access the exact same resource at the exact same time?

Solution is simple. The router intercepts both packets at the exact same time. It sees that both are going to the exact same destination. It also sees that both devices used the same internal port (5000). Does the router panic? No. It simply assigns two completely different, unique ports on its Global IP (12232) to act as the middleman channels. It creates a NAT Table that looks like this:

*\[Representation of the port address table (PAT)\]*

## ---

**Problem 2: Firewalls, Firewalls Everywhere**

Okay, so I have a global IP address, now what? I got to the URL bar of my Mac system, entered the global IP address of my device followed by the port of the server on my local machine, voila it works. I have a response.

Let's try it from the mobile network... Site is not reachable. Why? I switch on the Wi-Fi in my phone, enter the local IP of my laptop, retry the load on the webserver URL, succeeds. What is happening?

Enter, **The Firewall**.

"Firewall is a network security system that monitors and controls incoming and outgoing traffic based on predetermined security rules. Acting as a barrier between trusted and untrusted networks (e.g., the internet), it prevents unauthorized access and cyber threats. Firewalls can be hardware, software, or a combination."

A firewall is nothing but a rulebook. The computer or any system can have a rulebook of which connections to allow and which to reject.

*\[Visualization of how Firewall disallows certain network requests\]*

Okay, so what I did next was go to my router settings and learned that there is a setting known as DMZ.

A **DMZ (Demilitarized Zone)** on a home router is a security feature that exposes one local device completely to the internet, bypassing the firewall to open all TCP/UDP ports.

Boom, firewall gone, server up.

*\[DMZ config page on Router config page\]*

This seems a bit too lenient in terms of security doesn't it? Well in fact I just wanted to expose just one application through the NAT, so why expose the whole machine? Enter ALG.

An **Application Layer Gateway (ALG)** on a router is a security feature that inspects and modifies traffic for specific protocols (like SIP, FTP, or RTSP) to help them pass through Network Address Translation (NAT) firewalls.

Another alternative to this is **Port forwarding**. This will generally only expose certain ports to the internet like port 80, 443, 53, etc.

But alas this feature didn't exist on my router.

After disabling my router firewall for my IP Address, I finally excitedly hit the URL again and faced the same issue:

**"SITE NOT RESPONDING"**

FML\!\! What's wrong now??

## ---

**Problem 3: Carrier Firewall, The Bossfight of Networking Issues**

So I dig a bit deeper into this and guess what I find? Our ISPs like Airtel or Jio are running massive Carrier-Grade Firewalls.

Think of the ISP as a super paranoid head of security for the entire city of hotel buildings. They put strict inbound filtering on our residential fiber connections because they absolutely do not want you running some unauthorized server business from your room or accidentally inviting a massive zombie botnet into the network.

They just drop any uninvited visitors right at the city gate\! And if you think your neighbor in the exact same building can just walk over and knock on your digital door, think again. Thanks to **Client Isolation**, the whole splitter architecture is rigged. These Optical Line Terminals isolate everyone's traffic, forcing every single message to walk all the way out to the central gateway where that paranoid head of security just intercepts and drops it.

But wait a minute, my brain screams\! If this security guard drops everything coming in... **How the hell was I seeding on uTorrent or playing multiplayer games with zero issues?**

Well, it turns out there is a clever exception. Torrents and games work perfectly because my computer is the one making the very first move. It is an outbound-initiated connection\! When my laptop shouts out to a gaming server, it punches a tiny little tunnel right through the firewall. This magic trick is literally called **UDP hole punching**.

The ISP guard notes down that I started the conversation, so they let the reply come back through that specific hole. But my poor little custom Node server?

It is just sitting inside my laptop waiting for a completely random knock from the external world. Since I did not send an invite out first, the guard sees a stranger at the gate and kicks them out. Boom. "Site failed to respond." Mystery solved\!

## ---

**Tunneling: Three Problems, One Solution**
