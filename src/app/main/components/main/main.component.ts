import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalComponent } from 'src/app/layout/modal/modal.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WebinarModalComponent } from '../webinar-modal/webinar-modal.component';
import { Review } from '../../models';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    
    @ViewChild("webinarModal") webinarModal: WebinarModalComponent;
    @ViewChild("name") name: ElementRef;
    @ViewChild("email") email: ElementRef;
    @ViewChild("phone") phone: ElementRef;

    public webinarForm: FormGroup;
    public isShowMainBannerPresent = false;

    public reviews: Review[] = [
        {
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABM4SURBVHgBrVpZjF31ef+d5e6z3Nns8X5N8BIg9pSwlC0MAkJYTGxoq6JKJbR9QOqDqSr1qaqvG7ogVbV5S9UHqCIlDy01BCltVQVwqQIEsA0Y29hj+87i8exz9+Ws+X3fuXdMwMSY5Hj+dzn3LN/y+37fcmzgt7AdOpDPNl3sLtVLI7VKbVO1zPdaI9uotrKO1wIMj0d5Bd9zC57T+KDuBEfLi83D/32qUMBvuBn4itvrLxzIDmaze/3AG10sF0eXl8tYWlrG0uISarU6SstVVEolhAhgmiEMy+fNQoDvvu+j1vBQKjaPlarewZly8XCh2CzgK2w2rnLbPTKavffO6/auGuh7xkyZWbfqwjLiNIUF27aRsE04NEuMgsYsF57rwPd8hGHQvmMI0zLQlbSQGMyMWLb7ohNYGFiVfHHXnvv355/7QeEqxIF5NQc/dN3ovltGrjn/yJ578t19XVn4lDQQJ1I43+Uf4QIKG7h8d3W/H/gIgkCXfA5dfvZkX0iFgaH+OIayCfgt93snThTO//M//s2+q5HJ+jIHjeRGczvWbX393ru2/uEf/8muZCyRhOvQsq6LZquJWqWKUrmIWrWKerWGOiHUqNfRbDRofZfCigc8KkYYGQZMQ7DLd97d4orHY2g1A0zPVjG0Zmj00Qcf+p7XTL1SmBorXkm2K3rg0e/8+ZMZyz566625kSf+dA96h4aJjziFMBH6IdyWy5s7aDY9fXccvjeaujwqKFb3qITvBVQg1JgILYER40FgFfr0hIueNBUxWjjy/nEkM1Zu547NR1dlv7b7N1LgX/711X0LUxdfHF6dzN7/yCgGNm0B0n2IxVIIifmm66Feb6DVouBUxKXwbrOFerOBhuxzJAZ8FV7iQD67rjASBTckJkLxA1eANBVIJUJUF4pYmi/ia1vXZ791502HuuLr930lBV565X/3HX37SL5VXcSOka9h+003wU/2wKDwhghPa1cpfL3ZpBI1Wr8KRwQnbEQRsb7nUSFRwA90RbEQ8jd+d7hffxNPGIjHTCQk8M0WJgpTCrvbb78e27bl8nEzt++qFDh06Ke7iwut/Htv/gIb1nfjrvvuQLJ3iPFKwJqmxm2LlmwQJlVi3qOlHVpc6FEEdSQ2uFwq0IGPCOp7FJ6fXb67PM4jhDxfjvEVSslYiLgdYGZqGp6gi/T7nQduQzqFfNLa+OSXUuDQof/KWWbyhbdeOwIrbOFb992MLdd/nS6n1CExTOz7njC6qQK2Gi1CxVFECMYb9RaD11XLq5AiOI3stQX2ZSmUZImyLQrrw+G1aBsqwNgKHSUCyVIDA12447YbEITuwWw2l7uiAoZlvF6vIPveW+9j/aZ+3PjNHejN9itrKHPIKaFA2BTmJHSi4LVIKcL5wj4evRMq9g0KGCruxcqBHwVy4EfxIDBSSuXvgScsRSUovM1gXpyfVyMRXfjdW65HOmNm04meQ79WgVdf/Z99tpHIvf3z47CCBnbeuI20thZWLCkyR2mb1jItGwYFNoxQs2695hH/EtBkHl843iNkoBYWvOu7F2VgT1hKgztQxVyH746rnyXQhbUcEkG1UqHV6S3eNd2bxI5vbMVSsTby9NN/mb+sAgIdZsu8aSZx/OhxpDIBmSCHrp5+0l4ssj0hZFC4mB2DHUsohAgOlErLzAMlhY94QXAfhKEKHQnptb0QKHMGQr881xdI0sQa3BLkEhNUptmo4+KFGbzzzil8fHKCaxI9lMNxKpibvbj3wIED2Y7cK6UEeTlvGDFUlh1cnDiPr9/Qi57eHmS6uxlMxLzcTDOppwKIkGE7E7uuUGZDBRDc848Cuvo9UCEDGFwWr+MzlgQWVoyAFMEleIx2ScZj6QbSsoupE2cwPveBMp6sNHOPQXhVy7Usg+YZHp1f8YBYn1d5UkAyPTlPiixj9dpVdDmtLpHFm5u8mSGubtaxTIs3GhX1CHVSPIch+ZwBHgRGe4UqtKHJilcOIxl9XidUWUNlJscJ9XxPIRTlBoefl4qLzA4lXV7AAtGZQ4oslYzZ3BfsPZDPZz8FoWBUA5hCTIxfUPoaG1vAf/7oZ3DrgQpqOnWEjSqVa2jBFpAm47xYMhFnYotxf5PK2lpxhoHgJNSANWl1MYIhy1AWZhZvB7LjaVx0aqXOatADdddtO0WU4jEsRRKJmNZZjJOsk4o9s6KAaVt7xa8RU/LivMG58YIKURg7S1f7QjdkjQZCYrcTB+IZqW1aFL5WYzLjMZK8RKiwLa0oJUrIcWFgRNWDxFKb0+Q10BJDqU1h1/Kj+GjjauW1TJKYYGy0QX+3vkbwwYhILwftuGkLbhjZji7m9u6uFM6NnYtcLrQixZjcllDpZnyQ75Tnm0xiAp8G2cNVJomwb7JS64ghdmxxX4MwqTR9LLMMbzmBnifVncSF1ElSVgS+gQCf3Rj4NFy91dKr8YxRgZHNenRU4UOrsznBmnVD6MsO4+LkHGZn5zB3YZbQ8jXQAklekjQDiQubVNdgU1Ikjda0JhIKbZHb3UCCkUdbpgYmGZ5JjApwX4O/Nwgd0SwT99DjWch02bDjZhQz/OcGnxe/YwaBVIjIg246ttum6iNoB1VIJbp7eyksL5hIYWLqIk58GCPe60Shh0m67+zZ83BrDb3Z1OQM5heWiNmWxoAjBRvdLzjWOBA96KEKtV5gstMcgaicFvDQJWp14hKZHosNkCGopa1specv2oyOvCFGbMswd0pA6Q8M3ng8iXKxyTLCxYXZSRx3llBdKlMQF2NnPsG77xxD4dw4KpUymtUS4iKN0GuUN1U4sZ8nlqcS1ZaHMoVvhVEqNPXuaks0ZF8zCkSmGhhJU2MEK/j/rNhAMp7Sn8PomJzNAMr5HaTyrV5zCYsam5MmSoSGRbr85MOT2HbDtWQfcjGtWV6aR7lcpkVbKlgmE2fiiym0jAahWHf1Jh5x06RxnFC7ALjikRCRB8KI/iVorVaArhbjJR4JaV62zRIZTaxZMxxRtB5q7DRDI8gp9oj/kBi9ODONSrVMRqnzhj6qpK03X3tT65WLU7M4c3oMXdleeGSXueU6puaXMD61wGzsIbcph+HV/VoKuxS87klVys9t4Z02MAS/XSxHJL9boowQSKjaKA3blnF5D/Bv1aoBRBEv5yBrys0ih4aK3TJhYbAZr7Oul4azTgVee+3/kEiyCyPrXLv9Gmy69hoMb8yhEXBfmsqwVjo/vYATJ8dx/7fvxToSQSxma0wpPJQwo7Sf4GJHgTiN08udWfYBmYRJ/EdxEQaRLJcbmMSIgNXDQ1FPEdVcWblLRErqJPFvgHUb1mNy/DT522LwmiiMT6FaLOParZvQ3ZdCItONauNNZKiUzZmP0CiMNIuuAWxn6X38ozHWLEUe02pfGZGlRQla29Y8EO2Ls7VMsKywuaRkcUmzjhdexv4W+nv7yZDdUYwYocaLcFexEzSSbJIU6rbbb0eaQweNdDq9weHUhclJKjaMoUGyFGv4LHGfW9ePBG+a5FilJ92FPY/twvDaDUjE07CYrUWwBC2c5DEZWby+eICMyZKAlqfZ03FLG3t0VDVjLBs+T6MWIbtpwzqio9OOyikm2P8YRRoi29Hz9EfTeO+tDwiZDGsSJij6QF7PnT6PDblhjj98jDO5zV+4gN5MEkFvF+yBJHbtehgP77oXtpnQnkGCTBSQDwnP1AJPOZJ/1I1Lui9CKWFoL2FKI6NQNjR+gE97gcG7ei3uvvt2xovdNqwkpLDAMROO8YCc7KrVTPzHj36C4WEKX13QrCisIUE4PnGBTXcKQ6tWYQPhVF4qYj2xbtN8qwYHcfNtNyLVlWGxZ2i/kExIx2YpVATbMoLxjHCljVcqNCMrSsIzlFakz0hg8/o+lJq+Kt2oNrBpcw4PPPhtZLPp6DylbGl2jAJpNBiP5gIhZi4usAvrxp89/TDe/f+P8cMf/hjLlTkppXDixGkWbymsGhrATGESDTYy6XQSy0xkIWc61VJN2lqUFkra5CSTMUIjxZ65pWW4OMBoM43+M6KpiiffmQAtKmFZcfYeNh556EFkB1ehWKxrqdI32CODP62vrLATrxLw4QcmZzvHND2HUtPU8MDDd6jVd966E4899jhSVobhk8KpU+dYOrBpkYzLGHDY0E+en2SpMYNasYLJswXtnhYWlrUhEUvFbIueIF3aETxXYq39IoiSJVW0R+0dQkc8YNtJ9Ux3fw/6h7LR9AuxtssCrcWU3UzrqJ2M+S87nvlCdNWW0qVai+fced+tWFycQ3l5GSanD2fPjmPt2gFe2yBNWqhTIY8MVCsyF0xMwk52MXvPUUkOuljz2ISMxRRr254gW2lIyxyzPSCAJnEtt33fi5hJuNsIV6AiXtPs3d4XRUk7Yn3nsL1nz57ij//95TeC0Bi17DAqdVVTmSb4uOXeWzivAfqI7yo7toYwBIOui99j8TjhwvEhLTIwOKDmLLPsKJWqbFBChZ6MIGVqJw1PTKJXRi9h5AWJVV977EBTNNETjbm8QEt6FViqWinD28wj3yVe+Hfsr/P5gvYDTAyHJTmkOYCpExqXkkjIXrSHo/CWClmus1Oq1Fm3xNkr93BakaXHUsgO9WN4zSBOvX8U0+NjjI8aPeBibqnOtrCG+ZID1/B1rKIOkNkSIs5X3meD35Shrwjq+RrmUUFqqsBR73yJ6lWy0DgYHcHNieOgEYTF/r4+VMgwxqeaiQSFdaRlDKR4pBIM2BgVTbMfGBhejZGbv4m77r8HG7dciyobntUb1sCiy2p1B8VaU0trTleIby4KK0Er/YK0ATIjku+y0KZecb4laVkFNdqdXEfosL0MQcfhFQWeIoyYwp+3GHB+201oY01OsBiMPjstwZ88mIinukiZaWy5biseePQRbNpyHYUk/9sZdPUPwEpn0eTM32t7Uu4vVvTCqFKV4lFaS6FayzZWCgcR1o4nEM+ktdFp64BLkb+SHV7MEz4rCsjmOeZBalbs6cuiLDOZIGouRPuu7jRK3Ccn09PsVwmtvgHtyrKEkbSMMhOt1auYYDDPzC2wGJQ5p9XugaO2MUBnSgcdL5racnakCJXFeplTTDvR3nmpndSWN0C7sfL3YyXFtbennqIXwvD5NcNrMT09J9MNnXNKcdWV6WKRV1HXi1XrHB12U3AJ5BoHu9PTF/iMgLUPpxUOO7PuFOsllgjCVGLVaCQj1zOI9VBrHRHK0dYT7WC1aRyLEMxRkU6BGWFeWE89J62nF+7vWP9XFFAl/ujxPLn1WLavHwtzS8ocYXuMb5CLWzK0Ehixfk8ku5FMdzPRVXDqw1PwqnVUZpZx5qMz9GCVAvk6gWsS9w0K7EQTE/DJUtR5mVES86PqQmHls0xYt3FDVC4LhExrZQRjaM8fFvLf35f/tMyfm42GMXdP/2BfscynLUtLi9FTFWGj7l7Og8oaeCLMcrmuyade41jddxAwixp+DGc+OYfx2Wksyejd14pFen9IWSR5QWp9iVGxfKfBaUco97OVlT5an+hcGs8E0Wi+GLbCez4r7+d6n1deeqn4yHd/bzaVyew+f+ac8nIqyeqSHpidnSWtdqtLWxxxJATf8nSlJ6UjxYFsH4pzRQSk3RStl2b9HnjOSvKRWDCj2TDa5ZgOiaNZNxVkX7Fm42akWNlq4hbh1foaH0/87T/k376iArK9+spLx/bs+QMjk+kalQ6syMKtjxPqEjNvUtzKGei7P30HU4Wz2P6Na2SijeLiPHuIMczPzuP8RAGL9RIqThOddtWIUKGzIq2DOvBse0A8JIB598MTvF4ag4NDkXSGlDn+/mf/7vs/uJysX/iQ79WfvPTGdx//fWP14OBoiY99jvziCAKWCFMfnMLU8XM4cuQ4Vm8aYu/wOzqRWJqfw8njH+vnM1MTqMoDDqPTyUrdAvWcDkTarCOfxcIxapQUnLESYOmHoydPosqC8JpNm0WD/c/+/bP5L5Lzig+6/+mvntv99s9+/sL5qcmslbbRzTEi23BcZHz09PIRaW+C5fcwu6UkJsfGKGmIC/MzmGZAV6QtDaMY6HhAYdQ2m8yYTAZBigck2RcEfHdZwZ6er8rPxW25bX9xqnDqxV8n35d6Uj+S3J6rB+XX4/F4LtnXg3jfEKYWFrX5t8g0gRRinBxbISmUCm1csxrLi4vMB4uKXzNqClZu5geX2hXt1uJSuXLKRyg22BOcW24do3/28OfClWT7Us+JZ7yF4qJfeX59ut8ILWu0RVMulflsjAHqUvAWpw91MlGdj6SWOb2eouAeayp9nhANE1boziVcnDB6Pp4QdmJraVMJYSfuK9Za3nNlN3yCh17xGTFwlU/qjxTP5cnvmwPf+bdQwzPqIwId90mp4WlQSgdXCwKFS2fT+kXqfhmbQCYTUWtpRbP3In/eXw27Nk/VgzyuYvvK/9kjm+QDN8sddTxnr9tqjXA2IZP9ld9T9FKfYaxUkX6HNrmIGIUM++I3LMM47CSDg4Xil7P4b02BX92yOaA2StvLnHUnL5rbMtCfS+lTWUtK9GKpXGWpgmOEyziz0rFYFi9/VaE/vf0S+jemTNWaYK0AAAAASUVORK5CYII=",
            name: "Андрей Ефименко",
            text: "Не следует, однако забывать, что постоянный количественный рост и сфера нашей активности требуют от нас анализа систем массового участия. Разнообразный и богатый опыт дальнейшее развитие различных форм деятельности играет важную роль.",
            videoLink: "https://www.youtube.com/embed/-AuXxfDCfyI"
        },
        {
            image: "data:image/png;base64,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",
            name: "Оксана Солдатова",
            text: "Не следует, однако забывать, что постоянный количественный рост и сфера нашей активности требуют от нас анализа систем массового участия. Разнообразный и богатый опыт дальнейшее развитие различных форм деятельности играет важную роль.",
            videoLink: "https://www.youtube.com/embed/XVcwvhNgtws"
        },
        {
            image: "data:image/png;base64,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",
            name: "Светлана Вайс",
            text: "Не следует, однако забывать, что постоянный количественный рост и сфера нашей активности требуют от нас анализа систем массового участия. Разнообразный и богатый опыт дальнейшее развитие различных форм деятельности играет важную роль.",
            videoLink: "https://www.youtube.com/embed/LfkYOHMJDYM"
        },
        {
            image: "data:image/png;base64,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",
            name: "Алёна Васильева",
            text: "Не следует, однако забывать, что постоянный количественный рост и сфера нашей активности требуют от нас анализа систем массового участия. Разнообразный и богатый опыт дальнейшее развитие различных форм деятельности играет важную роль.",
            videoLink: "https://www.youtube.com/embed/_gNGQMkfWPM"
        }
    ];

    public activeReview: Review;

    constructor(private domSanitizer: DomSanitizer) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.isShowMainBannerPresent = true;
        }, 1000);

        this.activeReview = this.reviews[0];
    }

    showWebinarDialog(event){
        let webinarModal = document.getElementById('webinar-modal')
        webinarModal.classList.remove('hidden')
        webinarModal.classList.add('show');
    }

    hideMainBannerPresent() {
        this.isShowMainBannerPresent = false;
    }

    switchReview(review: Review) {
        this.activeReview = review;
        console.log(this.activeReview)
    }

    private normalizePhoneNumber(value: string): string {
        if (!value) return value;

        return value.replace(/-/g, "").replace(/ /g, "").replace("(", "").replace(")", "");
    }
}