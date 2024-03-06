package com.wsk.controller;

import com.wsk.pojo.UserInformation;
import com.wsk.response.BaseResponse;
import com.wsk.service.UserInformationService;
import com.wsk.tool.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.mail.*;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

/**
 * Created by wsk1103 on 2017/4/30.
 */
@Controller
public class Sendemail {

    @Resource
    private UserInformationService userInformationService;
    private static final Logger log = LoggerFactory.getLogger(Sendemail.class);

    //send the Email to the phone
    @RequestMapping(value = "sendCode.do", method = {RequestMethod.POST, RequestMethod.GET})
    @ResponseBody
    public BaseResponse sendEmail(HttpServletRequest req, HttpServletResponse res,
                                  @RequestParam String phone, @RequestParam String action,
                                  @RequestParam String token) {
        res.setContentType("text/html;charset=UTF-8");
        //token，防止重复提交
        String sendCodeToken = (String) req.getSession().getAttribute("token");
        if (StringUtils.getInstance().isNullOrEmpty(sendCodeToken) || !sendCodeToken.equals(token)) {
            return BaseResponse.fail();
        }
        //   判断手机号码是否为正确
        if (!StringUtils.getInstance().isEmil(phone)) {
            return BaseResponse.fail();
        }
        //如果是忘记密码提交的发送短信
        if ("forget".equals(action)) {
            if (!isUserPhoneExists(phone)) {
                //失败
                return BaseResponse.fail();
            }
        } else if ("register".equals(action)) {
            //失败
            if (isUserPhoneExists(phone)) {
                return BaseResponse.fail();
            }
        }
        //获取表单参数
        String email = phone;
        System.out.println(email);
        String emailString = getNumbers(5);
        req.getSession().setAttribute("emailcode",emailString);
        //创建Properties类用于记录邮箱的一些属性
        Properties props = new Properties();
        //表示SMTP发送邮件，必须进行身份验证
        props.put("mail.smtp.auth", "true");
        //此处填写SMTP服务器
        props.put("mail.smtp.host", "smtp.qq.com");
        //端口号，QQ邮箱端口465或587
        props.put( "mail.smtp. port","587");
        //此处填写，写信人的账号
        props.put( "mail.user","1448873576@qq.com");
        //此处填写16位STMP口令
        props.put( "mail.password" ,"atuainsfndszhceb");

        //构建授权信息，用于进行SMTP进行身份验证
        Authenticator authenticator = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                //用户名、密码
                String userName = props.getProperty( "mail.user" );
                String password = props.getProperty( "mail.password");
                return new PasswordAuthentication(userName,password);
            }
        };
        //使用环境属性和授权信息，创建邮件会话
        Session mailSession = Session.getInstance(props, authenticator);
        //创建邮件消息
        MimeMessage message = new MimeMessage(mailSession);
        try {
            //设置发件人
            InternetAddress form = new InternetAddress(props.getProperty("mail.user"));
            message.setFrom(form);
            //设置收件人的邮箱
            InternetAddress to = new InternetAddress(email);
            message.setRecipient(MimeMessage.RecipientType.TO, to);
            //设置邮件标题
            message.setSubject("恐龙优选系统注册验证码");
            //设置邮件内容体
            message.setContent("验证码："+emailString,"text/html;charset = UTF-8");
            //发送邮件
            Transport.send(message);
            String realPhone = phone;
            req.getSession().setAttribute("phone", realPhone);
            return BaseResponse.success();
        } catch (AddressException e) {
            e.printStackTrace();
            return BaseResponse.fail();
        } catch (MessagingException e) {
            e.printStackTrace();
            return BaseResponse.fail();
        }

    }

    // get the random phone`s code
    public String getNumbers(int size) {
        String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        String numString = "";
        Random r = new Random();
        for (int i = 0; i < size; i++) {
            char c = str.charAt(r.nextInt(str.length()));
            numString = numString +c;
        }
        return numString;

    }

    //To determine whether the user's mobile phone number exists
    private boolean isUserPhoneExists(String phone) {
        boolean result = false;
        try {
            int id = userInformationService.selectIdByPhone(phone);
            if (id == 0) {
                return result;
            }
            UserInformation userInformation = userInformationService.selectByPrimaryKey(id);

            if (StringUtils.getInstance().isNullOrEmpty(userInformation)) {
                return false;
            }
            String userPhone = userInformation.getPhone();
            result = !userPhone.equals("");
        } catch (Exception e) {
            e.printStackTrace();
            return result;
        }
        return result;
    }


}
