---
slug: networking-nat-firewalls-isps
title: 'Failing to Connect to My Own Server: A Story of NAT, IPv6, and Carrier Firewalls'
authors: [arjun]
tags: [networking, nat, firewall, isp]
---

# Failing to Connect to My Own Server: A Story of NAT, IPv6, and Carrier Firewalls

## Introduction

"Just how does a computer communicate with another computer?" a seventh-grade me asked myself. It seemed almost like magic! How does it happen that writing a message on my Yahoo Messenger gets delivered to a totally different computer?

Fast forward a few years. Enter **uTorrent**. I felt like I was in a wonderland. I read a bit about seeding and peering, but how did that actually work? I still didn't have an answer, but that question remained an itch in my stomach, growing bigger every day.

Fast forward a few more years, and I was introduced to **AJAX** and **XMLHttpRequest**. Okay, so you are telling me that a program can be written so that my computer will send a letter to another computer using the telephone line, and it will actually be delivered? That can't be real! How does it work?! I had to know.

:::learning Learning: Systems Curiosity
The most profound technical growth often starts with a simple "How does this work?" itch. Never ignore the magic—deconstruct it.
:::

<!-- truncate -->

## Problem Statement

Okay, so here I am a decade later, and I still don't know how to answer that question. But that thought stays with me. I always used to think about how computers actually communicate with each other.

Let's start small. Let's make a server that listens to a port waiting for a "request," and it returns a message back to wherever the request came from. Cool, simple.

But wait, the real challenge is that I must have the server running on my computer on my local network, and I should be able to use my phone on mobile data to knock at my router, asking for the message to be delivered to my laptop. Simple, right? Let's try it...

1. **Set up the server** (Node.js/Python).
2. **Ping from the local terminal**: It works! Voila, I am a genius.
3. **The Real Test**: I open my phone, turn off the Wi-Fi, turn on mobile data, and ping the public IP of my home network...

**Result:** "Site failed to respond."

WTF?? What's wrong??

:::tip Tip: Local vs. Public
Just because it works on `localhost` or `192.168.x.x` doesn't mean it's accessible to the world. Local pings only prove the server is alive within your own house.
:::

---

## Problem 1: Global IP Addresses, Ports, and the NAT

### Understanding the Need for a Global IP Address

Hmm... it seems like every computer has a **local IP** that is bounded by the router and whatever is connected to it. It seems like every router is assigned a **global IP address**. Think of it like a postal code, an address, and a flat number, but just in numbers.

And then, every router internally assigns a new number that represents the mapping of devices and their addresses inside that network.

For instance:
* **Global address of router** = `122.161.x.x`
* **Internal address of phone** = `192.168.1.5`
* **Internal address of laptop** = `192.168.1.10`

Now, if every device just has an internal address, how does an external sender know which device a message needs to be delivered to? Of course, a device outside of the local network doesn't know what IP my router has assigned to my phone or laptop. What's happening here???

![Figure 1: NAT Visualization](./img/nat-concept.png)
*Figure 1: Conceptual diagram showing multiple internal devices sharing a single Global IP through a Router.*

### The NAT Table

What…? The **NAT** meaning **Network Address Translation**. Oh yeah I know this, this is what always gave me a problem when trying to play *Call of Duty: Black Ops 2* multiplayer in my childhood. Yeah yeah, so what does this do exactly?

### An Example: Hotel California

Imagine the whole network under your router is like a hotel building, and the router is the security guard, receptionist, and lobby boy all rolled into one.

Let's say you decide to visit Google. You want that webpage displayed on your device, so your phone is like, "Ah, let me order a webpage for myself to see." It hits up the receptionist (the router) and says, "Hey router, I am room 1, get me this webpage!"

The router is like, "Okay, working on it." While your phone waits for the page to load, the router makes an entry in a ledger using a random number between 1 and 65535. This is called a **"port" number**. As it forwards your request to Google, it makes a note: *"If any response comes back on this port, I will return it to address 192.168.1.5."*

When Google returns the response on that specific port, the router knows exactly what to do. It checks its NAT table and forwards the webpage straight to the correct room that called it in.

:::learning Learning: NAT as a Middleman
NAT is essentially a stateful mapping system. It translates private internal addresses to a single public address by multiplexing them across different ports.
:::

### Conflict of Interest, Parallelization, and Identity Management

Okay, but what happens when 2 devices want to access the exact same resource at the exact same time?

The solution is simple. The router intercepts both packets. It sees that both are going to the same destination. It also sees that both devices might even use the same internal source port. Does the router panic? No. It simply assigns two completely different, unique ports on its **Global IP** to act as the middleman channels. It creates a **PAT (Port Address Translation)** Table that looks like this:

| Internal Device | Internal Port | External (NAT) Port | Destination |
| :--- | :--- | :--- | :--- |
| Phone (1.5) | 5000 | 45001 | Google |
| Laptop (1.10) | 5000 | 45002 | Google |

---

## Problem 2: Firewalls, Firewalls Everywhere

Okay, so I have a global IP address, now what? I went to the URL bar of my system, entered the global IP address followed by the port... it works locally.

Let's try it from the mobile network... **Site is not reachable.** Why? 

Enter, **The Firewall**.

> "A firewall is a network security system that monitors and controls incoming and outgoing traffic based on predetermined security rules. Acting as a barrier between trusted and untrusted networks, it prevents unauthorized access."

A firewall is nothing but a rulebook. The computer or any system can have a rulebook of which connections to allow and which to reject.

![Figure 2: Firewall Rejection](./img/firewall-block.png)
*Figure 2: Visualization of a Firewall dropping unsolicited inbound packets.*

### Bypassing the Barrier

Okay, so what I did next was go to my router settings and learned about **DMZ (Demilitarized Zone)**. A DMZ on a home router exposes one local device completely to the internet, bypassing the firewall to open all TCP/UDP ports.

Boom, firewall gone, server up... right?

Wait, exposing the whole machine is a bit too lenient for security. Why not just expose one application? Enter **ALG (Application Layer Gateway)** and **Port Forwarding**. Port forwarding only exposes specific ports (like 80 for HTTP or 443 for HTTPS) to the internet.

But alas, this feature didn't exist or work as expected on my router. After disabling my router firewall for my IP Address, I finally excitedly hit the URL again and faced the same issue:

**"SITE NOT RESPONDING"**

FML!! What's wrong now??

:::tip Tip: Security First
Never leave a device in the DMZ for long. It's like leaving your front door wide open in a crowded city just because you're waiting for a pizza delivery.
:::

---

## Problem 3: Carrier Firewall, The Bossfight of Networking Issues

So I dig a bit deeper into this and guess what I find? Our ISPs like Airtel or Jio are running massive **Carrier-Grade NAT (CGNAT)** and Firewalls.

Think of the ISP as a super paranoid head of security for the entire city of hotel buildings. They put strict inbound filtering on our residential fiber connections because they absolutely do not want you running some unauthorized server business from your room.

They just drop any uninvited visitors right at the city gate! And if you think your neighbor in the exact same building can just walk over and knock on your digital door, think again. Thanks to **Client Isolation**, the whole splitter architecture is rigged. These **Optical Line Terminals (OLTs)** isolate everyone's traffic, forcing every single message to walk all the way out to the central gateway where it's intercepted.

### The Mystery of Torrents

But wait a minute! If this security guard drops everything coming in... **How was I seeding on uTorrent or playing multiplayer games with zero issues?**

Well, it turns out there is a clever exception. Torrents and games work because my computer is the one making the very first move. It is an **outbound-initiated connection**! When my laptop shouts out to a gaming server, it punches a tiny little tunnel right through the firewall. This is called **UDP hole punching**.

The ISP guard notes down that I started the conversation, so they let the reply come back through that specific hole. But my poor little custom Node server? It is just sitting inside my laptop waiting for a completely random knock from the external world. Since I did not send an invite out first, the guard sees a stranger at the gate and kicks them out. 

:::learning Learning: UDP Hole Punching
Outbound traffic is usually trusted; inbound traffic is usually blocked. To receive data, you often need to "punch a hole" from the inside first.
:::

---

## Conclusion: Tunneling to the Rescue

Stay tuned for the next part where we explore **Tunneling**—the ultimate solution to these three problems. We'll look at how tools like Cloudflare Tunnels, Ngrok, or Tailscale allow us to bypass NAT and Firewalls entirely by creating a secure bridge from the inside out.

---
