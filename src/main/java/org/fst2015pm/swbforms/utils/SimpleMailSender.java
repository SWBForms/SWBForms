package org.fst2015pm.swbforms.utils;

import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class SimpleMailSender {
	static Properties properties;
	static SimpleMailSender instance = null;
	String host = "localhost";
	private static final ExecutorService processor = Executors.newSingleThreadExecutor();

	static {
		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			try {
                processor.shutdown();
                processor.awaitTermination(1, TimeUnit.MINUTES);
            } catch (InterruptedException ie) {
                ie.printStackTrace();
            }
        }));
    }
	
	protected SimpleMailSender() {		
		properties.setProperty("mail.smtp.host", host);
	    properties.setProperty("mail.smtp.starttls.enable", "true");
	    properties.setProperty("mail.smtp.ssl.trust", host);
	    properties.setProperty("mail.smtp.socketFactory.fallback", "true");
	}
	
	public static SimpleMailSender getInstance() {
		if (null == instance) instance = new SimpleMailSender();
		return instance;
	}
	
	public boolean sendMail(String from, String to, String body) {
		Session session = Session.getDefaultInstance(properties);
		
		processor.submit(() -> {
			try {
				// Create a default MimeMessage object.
				MimeMessage message = new MimeMessage(session);

				// Set From: header field of the header.
				message.setFrom(new InternetAddress(from));

				// Set To: header field of the header.
				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

	       		// Set Subject: header field
				message.setSubject("This is the Subject Line!");

				// Now set the actual message
				message.setText("This is actual message");

				// Send message
				Transport.send(message);
				System.out.println("Sent message successfully....");
		    } catch (MessagingException mex) {
		       mex.printStackTrace();
		    }
        });
		return true;
	}
}
